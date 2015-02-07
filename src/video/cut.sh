
# Les params début et fin pour les 3 vidéos :
# Rain 14 10
# fallingsnow 5 10
# dawsonfalls 24 11

avconv -i "$1".mp4 -vcodec copy -acodec copy -ss 00:"$2":"$3" -t 00:00:"$4" "$1".cut.mp4
avconv -i "$1".webm -vcodec copy -acodec copy -ss 00:"$2":"$3" -t 00:00:"$4" "$1".cut.webm
