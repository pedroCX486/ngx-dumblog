export class ArchiveModel {
    postTitle: string;
    timestamp: string;
    filename: string;

    constructor(archive?: ArchiveModel) {
        this.postTitle = archive?.postTitle || '';
        this.timestamp = archive?.timestamp || '';
        this.filename = archive?.filename || '';
    }
}
