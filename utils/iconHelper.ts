// utils/iconHelper.ts
// Utilitaire pour assurer que les icônes sont correctement chargées

import {
    Loader2,
    Search,
    Heart,
    MessageSquare,
    Facebook,
    Twitter,
    Linkedin,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    FileText,
    Users,
    Folder,
    Activity,
    CheckIcon,
    X,
    Menu,
    LogIn,
    LogOut,
    UserCheck,
    Key,
    ImageIcon,
    AlertCircle
} from 'lucide-vue-next'

// Mapping des noms d'icônes aux composants d'icônes
const iconMap = {
    loader: Loader2,
    search: Search,
    heart: Heart,
    messageSquare: MessageSquare,
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    arrowRight: ArrowRight,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    fileText: FileText,
    users: Users,
    folder: Folder,
    activity: Activity,
    check: CheckIcon,
    x: X,
    menu: Menu,
    logIn: LogIn,
    logOut: LogOut,
    userCheck: UserCheck,
    key: Key,
    image: ImageIcon,
    alertCircle: AlertCircle
}

/**
 * Récupère un composant d'icône par son nom
 * @param name - Le nom de l'icône à récupérer
 * @returns Le composant d'icône ou null si non trouvé
 */
export function getIconByName(name) {
    if (!name) return null
    return iconMap[name] || null
}

/**
 * Vérifie si un objet est un composant d'icône valide
 * @param icon - L'objet à vérifier
 * @returns true si c'est un composant d'icône valide, false sinon
 */
export function isValidIcon(icon) {
    if (!icon) return false
    return typeof icon === 'object' && icon !== null
}

/**
 * Exporte toutes les icônes chargées pour un accès direct
 */
export const icons = { ...iconMap }