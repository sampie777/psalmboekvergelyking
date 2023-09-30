export class Metadata {
    type = "AlternativeTitle";
    value = "";
}

export class Verse {
    name = "";
    content = "";
    language = "AF";
    index = 0;
}

export class Song {
    name = "";
    number = -1;
    verses: Verse[] = [];
    metadata: Metadata[] = [];
    language = "AF";
    beryming = 1;
    bundle = -1;
}

export class Document {
    name: string = "";
    content: string = "";
    language: string = "";
    index: number = 0;
    parent: DocumentGroup | null = null;
}

export class DocumentGroup {
    name: string = "";
    groups: Array<DocumentGroup> | null = null
    items: Array<Document> | null = null
    parent: DocumentGroup | null = null
}