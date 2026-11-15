export const variables = {
    ending: "(?:s|es|z|zs|ies|izs?|ves|ss+|zz+)?(?:ing|in|ed|er|ers)?(?:s|es|z|zs|ies|izs?|ves|ss+|zz+)?",
    beVerbs: "(?:am|is|are|was|were|be|been|being|aint|re|m|s|ve|d|ll|arent|wasnt|werent)",
    subjects: [ 
        "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "bro", "dude", 
        "man", "girl", "guy", "friend", "buddy", "pal", "mate", "homie", "sis", "fam", "boo", "chief", 
        "boss", "dawg", "neighbor", "teacher", "classmate", "colleague", "roommate", "sibling", "brother", 
        "sister", "woman", "someone", "somebody", "anyone", "anybody", "everyone", "everybody", "nobody", 
        "noone", "people", "person", "parent", "dad", "mom", "teacher", "professor", "classmate", "coworker", 
        "colleague", "roommate", "neighbor"
    ].join("|") 
};
