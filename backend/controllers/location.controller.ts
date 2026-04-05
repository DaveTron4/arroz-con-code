import type { Request, Response } from 'express';
import { pool } from '../config/database.ts';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

// GET /api/locations/search?query=free+english+classes&latitude=X&longitude=Y
// Public - searches nearby resources using OpenStreetMap Nominatim
const searchLocations = async (req: Request, res: Response) => {
    try {
        const { query, latitude, longitude } = req.query;

        if (!query) {
            res.status(400).json({ error: 'query is required' });
            return;
        }

        const lat = latitude ? parseFloat(latitude as string) : null;
        const lng = longitude ? parseFloat(longitude as string) : null;

        // Build Nominatim request
        const params: Record<string, string> = {
            q: query as string,
            format: 'json',
            limit: '10',
            addressdetails: '1',
        };

        // If coordinates provided, bias results toward user location
        if (lat && lng) {
            params.viewbox = `${lng - 0.5},${lat + 0.5},${lng + 0.5},${lat - 0.5}`;
            params.bounded = '0'; // Don't strictly limit to viewbox, just bias
        }

        const response = await axios.get(NOMINATIM_URL, {
            params,
            headers: {
                'User-Agent': 'ArrozzConCode/1.0 (hackathon project)',
            },
        });

        const results = response.data;

        // Save to location_searches table if user is logged in or coords provided
        if (lat && lng) {
            const userId = (req as any).user?.id || null;
            await pool.query(
                `INSERT INTO location_searches (user_id, query, latitude, longitude, results)
                 VALUES ($1, $2, $3, $4, $5)`,
                [userId, query, lat, lng, JSON.stringify(results)]
            );
        }

        res.json(results);
    } catch (err) {
        console.error('Error searching locations:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /api/locations/history
// Protected - get user's past location searches
const getSearchHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const result = await pool.query(
            `SELECT id, query, latitude, longitude, results, created_at
             FROM location_searches
             WHERE user_id = $1
             ORDER BY created_at DESC
             LIMIT 20`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching search history:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /api/locations/ai-search
// Public - accepts natural language query + coordinates, uses Gemini to extract keywords
const aiSearch = async (req: Request, res: Response) => {
    try {
        const { query, latitude, longitude } = req.body;

        if (!query) {
            res.status(400).json({ error: 'query is required' });
            return;
        }

        const lat = latitude ? parseFloat(latitude) : null;
        const lng = longitude ? parseFloat(longitude) : null;

        // Ask Gemini to extract search keywords from the natural language query
        const prompt = `You are a location search assistant. The user is looking for nearby places or organizations.

User query: "${query}"

Extract 2-3 short English search keywords suitable for OpenStreetMap Nominatim (e.g. "english classes", "free clinic", "community college").
Respond with ONLY a JSON array of strings, nothing else. Example: ["english classes", "adult education"]`;

        const geminiResult = await model.generateContent(prompt);
        const responseText = geminiResult.response.text();

        let keywords: string[] = [];
        try {
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                keywords = JSON.parse(jsonMatch[0]);
            }
        } catch {
            keywords = [query];
        }

        if (keywords.length === 0) keywords = [query];

        // Search Nominatim for each keyword and combine results
        const searchPromises = keywords.map(async (keyword: string) => {
            const params: Record<string, string> = {
                q: keyword,
                format: 'json',
                limit: '5',
                addressdetails: '1',
            };

            if (lat && lng) {
                params.viewbox = `${lng - 0.5},${lat + 0.5},${lng + 0.5},${lat - 0.5}`;
                params.bounded = '0';
            }

            const response = await axios.get(NOMINATIM_URL, {
                params,
                headers: { 'User-Agent': 'ArrozzConCode/1.0 (hackathon project)' },
            });

            return response.data;
        });

        const allResults = await Promise.all(searchPromises);

        // Flatten and deduplicate by place_id
        const seen = new Set<string>();
        const results = allResults.flat().filter((place: any) => {
            if (seen.has(place.place_id)) return false;
            seen.add(place.place_id);
            return true;
        });

        // Save to location_searches
        if (lat && lng) {
            const userId = (req as any).user?.id || null;
            await pool.query(
                `INSERT INTO location_searches (user_id, query, latitude, longitude, results)
                 VALUES ($1, $2, $3, $4, $5)`,
                [userId, query, lat, lng, JSON.stringify(results)]
            );
        }

        res.json({
            query,
            keywords,
            results,
        });
    } catch (err) {
        console.error('Error in AI location search:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default {
    searchLocations,
    aiSearch,
    getSearchHistory,
};
