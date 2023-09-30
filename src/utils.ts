import fs from "fs";
import {DocumentGroup, Song, Verse} from "./models";
import {skrifberyming} from "./samuel/skrifberyming";
import {heidelbergsekategismus} from "./samuel/heidelbergsekategismus";
import {psalmstotius} from "./samuel/psalmstotius";

export const cleanLine = (value: string): string => {
    return value
        .replaceAll("’", "'")
        .replaceAll("⁀", " ")
        .replaceAll(" - ", " – ")
        .replaceAll(RegExp(" -$", "gi"), " –")
};

const checkForBeryming = (line: string, song: Song): string => {
    //PSALM 23 (2de beryming)
    if (line.match(/\(1ste beryming\)/gi)) {
        song.name = song.name += " (Eerste beryming)"
        song.beryming = 1;
        line = line.replace(/\(1ste beryming\)/gi, "")
    } else if (line.match(/\(2de beryming\)/gi)) {
        song.name = song.name += " (Tweede beryming)"
        song.beryming = 2;
        line = line.replace(/\(2de beryming\)/gi, "")
    }

    return line
}

const textToSong = (data: string): Song[] => {
    let songs: Song[] = [];
    let song: undefined | Song;
    let verse: undefined | Verse;

    let stop = false;
    const lines = data.split("\n");
    lines.forEach((line) => {
        if (line.startsWith("Sondag 1")) stop = true;
        if (stop) return;

        if (line.startsWith("PSALM ")) {
            song = new Song();
            songs.push(song);

            const matches = Array.from(line.matchAll(/PSALM (\d+)/gi));
            song.number = +matches[0][1]
            song.name = "Psalm " + song.number
            song.bundle = 13
            checkForBeryming(line, song)
            return
        } else if (line.startsWith("SKRIFBERYMING ")) {
            song = new Song();
            songs.push(song);

            const matches = Array.from(line.matchAll(/SKRIFBERYMING (\d+)/gi));
            song.number = +matches[0][1]
            song.name = "Skrifberyming " + song.number
            song.bundle = 14
            return
        } else if (line.match(/^\d+(	| 	)/)) {
            verse = new Verse();
            song.verses.push(verse);

            const matches = Array.from(line.matchAll(/^(\d+)(	| 	)/gi));
            const verseNumber = +matches[0][1]
            verse.name = "Verse " + verseNumber;
            line = line.replace(/^(\d+)(	| 	)/gi, "")
        }
        if (line.trim().length === 0) return;
        if (!verse) {
            console.error("Got undefined verse", {line: line});
            return;
        }
        verse.content += "\n" + line.trim();
        verse.content = verse.content.trim();
    })

    return songs;
};

export const getPreparedOnlineSongBundleTotius = (): Song[] => {
    return (psalmstotius.content.songs as unknown as Song[]).map(it => {
        it.beryming = 1;
        it.bundle = 13;
        if (it.name.match("Tweede beryming")) {
            it.beryming = 2;
        } else if (it.name.match("Derde beryming")) {
            it.beryming = 3;
        }
        return it;
    })
}

export const getPreparedOnlineSongBundleSkrifberyming = (): Song[] => {
    return (skrifberyming.content.songs as unknown as Song[]).map(it => {
        it.beryming = 1;
        it.bundle = 14;
        return it;
    })
}

export const getPreparedOnlineDocumentGroupKategismus = (): DocumentGroup => {
    return heidelbergsekategismus.content as unknown as DocumentGroup;
}

export const readFile = (file: string): Promise<Song[]> => {
    return new Promise<Song[]>((resolve, reject) => {
        fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
            if (err) {
                console.error("Could not read file", err);
                reject(err);
                return;
            }

            const songs = textToSong(data);
            resolve(songs);
        })
    })
}

export const htmlToText = (html: string): string => {
    return html
        .replaceAll(/<(sup|sub)>(.*?)<\/(sup|sub)>/gi, "*")
        .replaceAll(/<\/?(strong|i|b|ol|ul)>/gi, "")
        .replaceAll(/<(p|h1|h2|h3|h4|h5|h6)>/gi, "")
        .replaceAll(/<\/(p|h1|h2|h3|h4|h5|h6|li)>/gi, "\n")
        .replaceAll(/<li>/gi, "* ")
}