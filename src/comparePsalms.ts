import {Song, Verse} from "./models";
import {
    cleanLine,
    getPreparedOnlineSongBundleSkrifberyming,
    getPreparedOnlineSongBundleTotius,
    readFile
} from "./utils";

const comparisonFile = "./src/louise/text-windows-1258-improved.txt";


let verseLineMismatches = 0;

const compareVerse = (truth: Verse, compare: Verse) => {
    if (truth.name !== compare.name) {
        console.warn("Verse names differ", {truth: truth, compare: compare});
    }

    const truthLines = truth.content.split("\n");
    const compareLines = compare.content.split("\n");

    if (truthLines.length !== compareLines.length) {
        console.warn("Verse content length differ", {
            truth: truthLines.map((it, i) => `${i} ${it}`),
            compare: compareLines.map((it, i) => `${i} ${it}`)
        });
    }

    truthLines.map(cleanLine)
        .forEach((truthLine, i) => {
            const line = compareLines[i] ? cleanLine(compareLines[i]) : compareLines[i];
            if (truthLine !== line) {
                verseLineMismatches++;
                console.warn(`  ${truth.name} line differ`, {truth: truthLine, compare: line});
            }
        })
}

const compareSong = (truth: Song, compare: Song) => {
    console.debug(`Comparing ${truth?.name}`)
    if (truth.verses.length !== compare.verses.length) {
        console.warn("Songs verses are not the same length", {
            truth: truth.verses.length,
            compare: compare.verses.length
        })
    }

    const comparedVerses: Verse[] = [];

    truth.verses.forEach((truthVerse, i) => {
        const verse = compare.verses[i];
        if (verse == null) {
            console.warn("Missing verse", {verse: truthVerse, index: i});
            return;
        }

        comparedVerses.push(verse);
        compareVerse(truthVerse, verse);
    })

    compare.verses.filter(it => !comparedVerses.includes(it))
        .forEach(it => console.warn("Verses too much", {compare: it.name}))
}

const compareSongs = (truthSongs: Song[], compareSongs: Song[]) => {
    if (truthSongs.length !== compareSongs.length) {
        console.warn("Songs are not the same length", {truth: truthSongs.length, compare: compareSongs.length})
    }

    const comparedSongs: Song[] = []

    truthSongs.forEach(truthSong => {
        const song = compareSongs.find(it => it.bundle === truthSong.bundle && it.number === truthSong.number && it.beryming === truthSong.beryming);
        if (song == null) {
            console.warn("Missing song", {truth: truthSong.name});
            return;
        }
        comparedSongs.push(song);
        compareSong(truthSong, song);
    })

    compareSongs.filter(it => !comparedSongs.includes(it))
        .forEach(it => console.warn("Song too much", {compare: it.name}))

    console.warn(`${verseLineMismatches} different lines found`)
};


const main = async () => {
    console.debug("Starting");
    const songs = await readFile(comparisonFile);
    const onlineSongs = [...getPreparedOnlineSongBundleTotius(), ...getPreparedOnlineSongBundleSkrifberyming()];
    compareSongs(onlineSongs, songs);
    console.debug("Done");
}

main();