import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.bharath.aora',
    projectId: '6644e6ef0018237059f5',
    databaseId: '6644e8f9002b3babd93c',
    userCollectionId: '6644e9210015060abbe0',
    videoCollectionId: '6644e93c001fe45445d2',
    storageId: '6644ea4b002c0d8b0062'
}

const { endpoint, platform, projectId, databaseId, userCollectionId, videoCollectionId, storageId } = config;

const client = new Client();

client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setPlatform(platform)
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (username, email, password) => {
    try {
    const newAccount = await account.create(ID.unique(), email, password, username);

    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(databaseId, userCollectionId, ID.unique(), {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
    })

    return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        return session;
    } catch (error) {
        throw new Error(error);
        
    }
}

export const getCurrentUser = async () => {
    try {
        //Get the currently logged in user account
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        );

        if (!posts) throw new Error("Something went wrong");

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
        );

        if (!posts) throw new Error("Something went wrong");

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}


export const getLikedPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId);

        if (!posts || !posts.documents) {
            throw new Error("Something went wrong");
        }

        // Filter videos where the liked array contains the userId
        const likedPosts = posts.documents.filter(post =>
            post.liked && post.liked.some(user => user.$id === userId)
        );

        return likedPosts;
    } catch (error) {
        throw new Error(error);
    }
}

export const updatePostLikes = async (postId, userId) => {
    try {
        // Retrieve the post with the specified videoId
        const response = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('$id', postId)]
        );
        
        
        if (!response || response.documents.length === 0) {
            throw new Error("Post not found");
        }
        
        const post = response.documents[0];
        
        // Check if userId is already in the liked array
        let updatedLikes = post.liked || [];
        const index = updatedLikes.findIndex(user => user.$id === userId);

        if (index !== -1) {
            // If userId is already in the liked array, remove it (unlike)
            updatedLikes.splice(index, 1);
        } else {
            // If userId is not in the liked array, add it (like)
            updatedLikes.push({ $id: userId });
        }
        
        // Update the post with the new liked array
        await databases.updateDocument(
            databaseId,
            videoCollectionId,
            post.$id,
            { liked: updatedLikes }
        );
    } catch (error) {
        throw new Error(error.message);
    }
};

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if(type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if(type === 'image') {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100);
        } else {
            throw new Error('Invalid file type');
        }

        if(!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
} 

export const uploadFile = async (file, type) => {
    if(!file) return;

    const {mimeType, ...props} = file;
    //Modifying the file structure as this is the structure Appwrite accepts
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video'),
        ]);

        const newPost = await databases.createDocument(
            databaseId, videoCollectionId, ID.unique(), {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(error);
        
    }
}