export class PostModel {
    postTitle: string;
    timestamp: string;
    editedTimestamp: string;
    postContent: string;
    filename: string;
    draft: boolean;

    constructor(post?: PostModel) {
        this.postTitle = post?.postTitle || '';
        this.timestamp = post?.timestamp || '';
        this.editedTimestamp = post?.editedTimestamp || '';
        this.postContent = post?.postContent || '';
        this.filename = post?.filename || '';
        this.draft = post?.draft || false;
    }
}
