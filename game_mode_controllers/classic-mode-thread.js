function LevenshteinDistance (source, target, options) {
    options = options || {};
    if(isNaN(options.insertion_cost)) options.insertion_cost = 1;
    if(isNaN(options.deletion_cost)) options.deletion_cost = 1;
    if(isNaN(options.substitution_cost)) options.substitution_cost = 1;

    var sourceLength = source.length;
    var targetLength = target.length;
    var distanceMatrix = [[0]];

    for (var row =  1; row <= sourceLength; row++) {
        distanceMatrix[row] = [];
        distanceMatrix[row][0] = distanceMatrix[row-1][0] + options.deletion_cost;
    }

    for (var column = 1; column <= targetLength; column++) {
        distanceMatrix[0][column] = distanceMatrix[0][column-1] + options.insertion_cost;
    }

    for (var row = 1; row <= sourceLength; row++) {
        for (var column = 1; column <= targetLength; column++) {
            var costToInsert = distanceMatrix[row][column-1] + options.insertion_cost;
            var costToDelete = distanceMatrix[row-1][column] + options.deletion_cost;

            var sourceElement = source[row-1];
            var targetElement = target[column-1];
            var costToSubstitute = distanceMatrix[row-1][column-1];
            if (sourceElement !== targetElement) {
                costToSubstitute = costToSubstitute + options.substitution_cost;
            }
            distanceMatrix[row][column] = Math.min(costToInsert, costToDelete, costToSubstitute);
        }
    }
    return distanceMatrix[sourceLength][targetLength];
}

function checkAnswer(maxLength, songArtist, songTitle, answer) {
    songArtist = decodeURI(songArtist);
    songTitle = decodeURI(songTitle);
    answer = decodeURI(answer);
    var correctArtistPrepared = songArtist.toLowerCase().substr(0, maxLength);
    var correctTitlePrepared = songTitle.toLowerCase().substr(0, maxLength);
    var answerPrepared = answer.toLowerCase().substr(0, maxLength);
    var artistLevenshtein = LevenshteinDistance(correctArtistPrepared, answerPrepared);
    var titleLevenshtein = LevenshteinDistance(correctTitlePrepared, answerPrepared);
    var artistSimilarity = 1 - artistLevenshtein / correctArtistPrepared.length;
    var titleSimilarity = 1 - titleLevenshtein / correctTitlePrepared.length;
    return JSON.stringify({
        correctArtist: artistSimilarity > 0.75,
        correctTitle: titleSimilarity > 0.75/*,
        debug: {
            artistSimilarity: artistSimilarity,
            titleSimilarity: titleSimilarity,
            artistLevenshtein: artistLevenshtein,
            titleLevenshtein: titleLevenshtein,
            correctArtistPrepared: correctArtistPrepared,
            LevenshteinDistance: LevenshteinDistance('huy', 'huylo')
        }
        */
    });
}