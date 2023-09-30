Repo om gou die verskille in database tussen L. en S. te vergelyk.

L. se files is in [src/louise](src%2Flouise). Die oorspronklike file is [Psalmboek Afrikaans - 2023-04-03 .txt](src%2Flouise%2FPsalmboek%20Afrikaans%20-%202023-04-03%20.txt). Omdat die encoding nie deur Linux herken word nie, is daar 'n nuwe file ([text-windows-1258.txt](src%2Flouise%2Ftext-windows-1258.txt)) gemaak wat die oorspronklike file gebruik maar as Windows-1258 encoding lees. Dan is daar 'n derde file ([text-windows-1258-improved.txt](src%2Flouise%2Ftext-windows-1258-improved.txt)) waarin sekere goed (woorde, typos, ..) reggemaak is om die vergelykingsproses beter te laat verloop. Die goed wat reggemaak is word beskrywe in [Database verskille.txt](Database%20verskille.txt). Die script [comparePsalms.ts](src%2FcomparePsalms.ts) (`bun run src/comparePsalms.ts`) is gebruik om die groot verskille uit te ken. 

S. se files is in [src/samuel](src%2Fsamuel). Die data wat uit die database uit kom is in drie files opgeslaan. Die data word gebruik vir die vergelyking. As mens die script [src/convertJScheduleDateToTxt.ts](src%2FconvertJScheduleDateToTxt.ts) hardloop (`bun run src/convertJScheduleDateToTxt.ts`), word al daai data na 'n txt file gexporteerd ([samuel/jSchedule.txt](src%2Fsamuel%2FjSchedule.txt)) in dieselfde format as wat L. se files is. Dit kan dan gebruik word vir handmatige vergelyking.

## Comparison

Die file [COMPARISON.txt](COMPARISON.txt) word gebruik om GIT se comparison feature te gebruik. Die eerste commit vir die file is L. se data. Die tweede commit sal S. se data wees. Die git diff sal dan die verskille wys.

Die file [COMPARISON.txt](COMPARISON.txt)[COMPARISON_letters_only.txt](COMPARISON_letters_only.txt) word ook gebruik om GIT se comparison feature te gebruik. Die verskil is dat by hierdie file, al die hoofletters en leestekens geneutraliseer is, sodat dit net die regte verskille (woord betekenisse) sal wys. Die eerste commit vir die file is L. se data. Die tweede commit sal S. se data wees. Die git diff sal dan die verskille wys.

## Scripts

[bun](https://bun.sh/) en Typescript word gebruik vir die scripts. `bun install` om die project op te stel en dan `bun run <file>` om die script te run. 

Niks is final nie. Die scripts is maar net 'gougou' om 'n groot werk makliker te maak.

