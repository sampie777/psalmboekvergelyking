import {DocumentGroup, Song} from "./models";
import {
    getPreparedOnlineDocumentGroupKategismus,
    getPreparedOnlineSongBundleSkrifberyming,
    getPreparedOnlineSongBundleTotius, htmlToText,
} from "./utils";
import fs from "fs";

const outputFile = "./src/samuel/jSchedule.txt";

const generateTextForSongs = (songs: Song[]): string => {
    return songs
        .sort((a, b) => a.beryming - b.beryming)
        .sort((a, b) => a.number - b.number)
        .sort((a, b) => a.name[0].localeCompare(b.name[0]))
        .flatMap(song => {
            const alternativeTitle = song.metadata.find(it => it.type === "AlternativeTitle")?.value;
            const songTitle = song.name.toUpperCase()
                    .replace("EERSTE BERYMING", "1ste beryming")
                    .replace("TWEEDE BERYMING", "2de beryming")
                + (alternativeTitle ? ` – ${alternativeTitle}` : "")
            return [
                songTitle,
                ...song.verses.map(verse => {
                    return (verse.index + 1) + "\t" + verse.content
                        .replaceAll("'", "’")
                        .replaceAll(/(^| |\n)"/gi, "$1“")
                        .replaceAll("\"", "”")
                        .replaceAll(" -", " –")
                        .replaceAll("⁀", " ")
                })
            ]
        })
        .join("\n");
};

const generateTextForDocumentGroups = (groups: DocumentGroup[]): string => {
    return groups
        .flatMap(group => {
            return group.items.map(doc => {
                return [
                    doc.name,
                    htmlToText(doc.content.replaceAll(/<(ol|ul)>/gi, "@#<$1>"))
                        .replaceAll(/(\d+\. )Vraag: +/gi, "@#$1")
                        .replaceAll(/(^|\n)Antwoord: +/gi, "@#$1")
                        .replaceAll(/(^|\n|@#)(\d+)\. /gi, "$1$2\t")
                        .replaceAll(/\n+/gi, "")
                        .replaceAll(/@#/gi, "\n")
                        .replaceAll("'", "’")
                        .replaceAll(/(^| |\n)"/gi, "$1“")
                        .replaceAll("\"", "”")
                        .replaceAll(" -", " –")
                ].join("\n");
            })
        })
        .join("\n")
        .replaceAll(/\n+/gi, "\n");
};

const convertToText = (songs: Song[], groups: DocumentGroup[]) => {
    const songText = generateTextForSongs(songs);
    const documentText = generateTextForDocumentGroups(groups);
    console.log(documentText);
    fs.writeFile(outputFile, songText + "\n" + documentText, (err) => {
        if (err) console.error("Failed to write to file", err)
        else console.log("File saved");
    })
}

const main = async () => {
    console.debug("Starting");
    const onlineSongs = [...getPreparedOnlineSongBundleTotius(), ...getPreparedOnlineSongBundleSkrifberyming()];
    convertToText(onlineSongs, [getPreparedOnlineDocumentGroupKategismus()]);
    console.debug("Done");
}

main();