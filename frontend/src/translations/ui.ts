/**
 * UI Text Translations
 * Provides English and Spanish translations for app UI elements
 */

export type Language = "en" | "es";

export type TranslationKey = 
  // Common
  | "save"
  | "cancel"
  | "delete"
  | "edit"
  | "close"
  | "loading"
  | "error"
  | "success"
  // Navigation
  | "home"
  | "community"
  | "profile"
  | "settings"
  | "signIn"
  | "signUp"
  | "signOut"
  | "search"
  // Settings
  | "settingsTitle"
  | "preferredLanguage"
  | "selectLanguage"
  | "english"
  | "spanish"
  | "languageSaved"
  | "languageError"
  | "signOutConfirm"
  // Posts
  | "createPost"
  | "createArticle"
  | "title"
  | "content"
  | "category"
  | "publish"
  | "draft"
  | "delete"
  | "like"
  | "unlike"
  | "comment"
  | "share"
  | "translate"
  | "showOriginal"
  | "noTranslation"
  // Profile
  | "myProfile"
  | "edit"
  | "editProfile"
  | "displayName"
  | "username"
  | "email"
  | "location"
  | "profilePicture"
  | "profilePictureURL"
  | "myPosts"
  | "myArticles"
  | "followers"
  | "following"
  // Feed
  | "feedEmpty"
  | "noPostsYet"
  | "noArticlesYet"
  | "loadMore"
  | "refresh"
  // Auth
  | "loginTitle"
  | "registerTitle"
  | "password"
  | "confirmPassword"
  | "passwordMismatch"
  | "usernameTaken"
  | "emailTaken"
  | "loginFailed"
  | "registerFailed"
  | "forgotPassword"
  | "rememberMe"
  | "alreadyHaveAccount"
  | "noAccount"
  | "welcomeBack"
  | "signingIn"
  | "signingUp"
  | "usernameRequired"
  | "passwordRequired"
  | "emailRequired"
  | "locationDenied"
  | "locationDetected"
  | "at least 8 characters"
  | "createAccount"
  | "creatingAccount"
  | "aiChat"
  | "aiSearch"
  | "newPost"
  | "post"
  | "goBack"
  | "titleRequired"
  | "bodyRequired"
  | "onlyProfessionalsArticles"
  | "postSuccess"
  | "postError"
  | "publishing";

const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    // Navigation
    home: "Home",
    community: "Community",
    profile: "Profile",
    settings: "Settings",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    search: "Search",
    // Settings
    settingsTitle: "Settings",
    preferredLanguage: "Preferred Language",
    selectLanguage: "Select your preferred language",
    english: "English",
    spanish: "Spanish",
    languageSaved: "Language preference saved successfully",
    languageError: "Failed to save language preference",
    signOutConfirm: "Are you sure you want to sign out?",
    // Posts
    createPost: "Create Post",
    createArticle: "Create Article",
    title: "Title",
    content: "Content",
    category: "Category",
    publish: "Publish",
    draft: "Draft",
    like: "Like",
    unlike: "Unlike",
    comment: "Comment",
    share: "Share",
    translate: "Translate",
    showOriginal: "Show Original",
    noTranslation: "Translation not available",
    // Profile
    myProfile: "My Profile",
    editProfile: "Edit Profile",
    displayName: "Display Name",
    username: "Username",
    email: "Email",
    location: "Location",
    profilePicture: "Profile Picture",
    profilePictureURL: "Profile Picture URL",
    myPosts: "My Posts",
    myArticles: "My Articles",
    followers: "Followers",
    following: "Following",
    // Feed
    feedEmpty: "No posts yet",
    noPostsYet: "No posts yet",
    noArticlesYet: "No articles yet",
    loadMore: "Load More",
    refresh: "Refresh",
    // Auth
    loginTitle: "Sign In",
    registerTitle: "Sign Up",
    password: "Password",
    confirmPassword: "Confirm Password",
    passwordMismatch: "Passwords do not match",
    usernameTaken: "Username already taken",
    emailTaken: "Email already taken",
    loginFailed: "Login failed",
    registerFailed: "Registration failed",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember me",
    alreadyHaveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    welcomeBack: "Welcome back",
    signingIn: "Signing in...",
    signingUp: "Signing up...",
    usernameRequired: "Username is required",
    passwordRequired: "Password is required",
    emailRequired: "Email is required",
    locationDenied: "Location access denied. You can add your location manually.",
    locationDetected: "✓ Location detected",
    "at least 8 characters": "At least 8 characters",
    createAccount: "Create an account",
    creatingAccount: "Creating account...",
    aiChat: "AI Chat",
    aiSearch: "AI Search",
    newPost: "New Post",
    post: "Post",
    goBack: "Go back",
    titleRequired: "Title is required",
    bodyRequired: "Post body is required",
    onlyProfessionalsArticles: "Only professionals can create articles",
    postSuccess: "Post created successfully",
    postError: "Failed to create post",
    publishing: "Publishing...",
  },
  es: {
    // Common
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    close: "Cerrar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    // Navigation
    home: "Inicio",
    community: "Comunidad",
    profile: "Perfil",
    settings: "Configuración",
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    signOut: "Cerrar Sesión",
    search: "Buscar",
    // Settings
    settingsTitle: "Configuración",
    preferredLanguage: "Idioma Preferido",
    selectLanguage: "Selecciona tu idioma preferido",
    english: "Inglés",
    spanish: "Español",
    languageSaved: "Preferencia de idioma guardada exitosamente",
    languageError: "Error al guardar la preferencia de idioma",
    signOutConfirm: "¿Estás seguro de que deseas cerrar sesión?",
    // Posts
    createPost: "Crear Publicación",
    createArticle: "Crear Artículo",
    title: "Título",
    content: "Contenido",
    category: "Categoría",
    publish: "Publicar",
    draft: "Borrador",
    like: "Me gusta",
    unlike: "Ya no me gusta",
    comment: "Comentar",
    share: "Compartir",
    translate: "Traducir",
    showOriginal: "Mostrar Original",
    noTranslation: "Traducción no disponible",
    // Profile
    myProfile: "Mi Perfil",
    editProfile: "Editar Perfil",
    displayName: "Nombre Mostrado",
    username: "Usuario",
    email: "Correo",
    location: "Ubicación",
    profilePicture: "Foto de Perfil",
    profilePictureURL: "URL de Foto de Perfil",
    myPosts: "Mis Publicaciones",
    myArticles: "Mis Artículos",
    followers: "Seguidores",
    following: "Siguiendo",
    // Feed
    feedEmpty: "Sin publicaciones aún",
    noPostsYet: "Sin publicaciones aún",
    noArticlesYet: "Sin artículos aún",
    loadMore: "Cargar Más",
    refresh: "Actualizar",
    // Auth
    loginTitle: "Iniciar Sesión",
    registerTitle: "Registrarse",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    passwordMismatch: "Las contraseñas no coinciden",
    usernameTaken: "Usuario ya existe",
    emailTaken: "Correo ya existe",
    loginFailed: "Error al iniciar sesión",
    welcomeBack: "Bienvenido de vuelta",
    signingIn: "Iniciando sesión...",
    signingUp: "Registrándose...",
    usernameRequired: "El usuario es requerido",
    passwordRequired: "La contraseña es requerida",
    emailRequired: "El correo es requerido",
    titleRequired: "El título es requerido",
    bodyRequired: "El contenido de la publicación es requerido",
    onlyProfessionalsArticles: "Solo los profesionales pueden crear artículos",
    postSuccess: "Publicación creada exitosamente",
    postError: "Error al crear la publicación",
    publishing: "Publicando...",
    locationDenied: "Acceso a ubicación denegado.",
    aiChat: "Chat IA",
    aiSearch: "Búsqueda IA",
    newPost: "Nueva Publicación",
    post: "Publicación",
    goBack: "Volver atrás",
    locationDetected: "✓ Ubicación detectada",
    "at least 8 characters": "Al menos 8 caracteres",
    createAccount: "Crear una cuenta",
    creatingAccount: "Creando cuenta...",
    registerFailed: "Error al registrarse",
    forgotPassword: "¿Olvidaste tu contraseña?",
    rememberMe: "Recuérdame",
    alreadyHaveAccount: "¿Ya tienes cuenta?",
    noAccount: "¿No tienes cuenta?",
  },
};

export function getTranslation(key: TranslationKey, language: Language): string {
  return translations[language]?.[key] ?? translations.en[key] ?? key;
}
