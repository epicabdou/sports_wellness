// Types for User data
export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    phoneNumber?: string;
    isAdmin: boolean;
    verified: boolean;
    created: string;
    updated: string;
}

// Types for Auth data
export interface AuthData {
    token: string;
    user: User;
}

// Types for Category
export interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
    slug: string;
    created: string;
    updated: string;
}

// Types for Post
export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    isPublished: boolean;
    image?: string;
    content: string;
    category: string;
    tags?: string;
    author?: string;
    created: string;
    updated: string;
    expand?: {
        category?: Category;
        author?: User;
    };
    likesCount?: number;
    userHasLiked?: boolean;
}

// Types for Comment
export interface Comment {
    id: string;
    user: string;
    post: string;
    content: string;
    created: string;
    updated: string;
    expand?: {
        user?: User;
        post?: Post;
    };
}

// Types for Like
export interface Like {
    id: string;
    user: string;
    post: string;
    created: string;
    updated: string;
}

// Types for UserActivity
export interface UserActivity {
    id: string;
    user: string;
    activity: {
        type: 'login' | 'logout' | 'profile_update' | 'password_change' | 'post_view' | 'post_like' | 'post_unlike' | 'post_comment';
        data?: any;
        timestamp: string;
    };
    created: string;
    updated: string;
    expand?: {
        user?: User;
    };
}

// Types for Newsletter
export interface Newsletter {
    id: string;
    name: string;
    email: string;
    phone: string;
    age?: string;
    weight?: string;
    height?: string;
    city: string;
    conscient: boolean;
    created: string;
    updated: string;
}