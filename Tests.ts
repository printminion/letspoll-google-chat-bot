import UI = require("./UI");
import AI = require("./AI");

function test_parseAction() {
    const input = '"title" "item 1" "item 2"';
    const result = AI.parseAction(input);
    console.log("result", result);
    const message = UI.createVoteCardMessage(result);

    console.log("message", message);
}

var event = {
    "message": {
        "createTime": {
            "nanos": 497711000,
            "seconds": 1581116275
        },
        "name": "spaces/AAAAX5_xtFM/messages/nF_CXAECza4.PoJtkZFclz8",
        "space": {
            "name": "spaces/AAAAX5_xtFM",
            "threaded": true,
            "displayName": "test room",
            "type": "ROOM"
        },
        "cards": [
            {
                "sections": [
                    {
                        "widgets": [
                            {
                                "keyValue": {
                                    "content": "Burgers",
                                    "button": {
                                        "textButton": {
                                            "text": "VOTE",
                                            "onClick": {
                                                "action": {
                                                    "parameters": [
                                                        {
                                                            "value": "0",
                                                            "key": "id"
                                                        },
                                                        {
                                                            "value": "[]",
                                                            "key": "voters"
                                                        }
                                                    ],
                                                    "actionMethodName": "vote"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                "keyValue": {
                                    "content": "Pizza",
                                    "button": {
                                        "textButton": {
                                            "text": "VOTE",
                                            "onClick": {
                                                "action": {
                                                    "parameters": [
                                                        {
                                                            "key": "id",
                                                            "value": "1"
                                                        },
                                                        {
                                                            "value": "[]",
                                                            "key": "voters"
                                                        }
                                                    ],
                                                    "actionMethodName": "vote"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                "keyValue": {
                                    "content": "Sushi",
                                    "button": {
                                        "textButton": {
                                            "onClick": {
                                                "action": {
                                                    "actionMethodName": "vote",
                                                    "parameters": [
                                                        {
                                                            "value": "2",
                                                            "key": "id"
                                                        },
                                                        {
                                                            "value": "[]",
                                                            "key": "voters"
                                                        }
                                                    ]
                                                }
                                            },
                                            "text": "VOTE"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ],
                "header": {
                    "title": "What should we order for lunch?"
                }
            }
        ],
        "sender": {
            "name": "users/104640216889674963064",
            "displayName": "LetsPoll",
            "type": "BOT",
            "avatarUrl": "https://lh4.googleusercontent.com/proxy/BLZPdLf33gEgeCEkm9kSCIH-CEWH8i4ZrOuFaN2rmq-0G68j3vDl8Hw"
        },
        "thread": {
            "retentionSettings": {
                "state": "PERMANENT"
            },
            "name": "spaces/AAAAX5_xtFM/threads/nF_CXAECza4"
        }
    },
    "action": {
        "actionMethodName": "vote",
        "parameters": [
            {
                "key": "id",
                "value": "1"
            },
            {
                "value": "[]",
                "key": "voters"
            }
        ]
    },
    "user": {
        "email": "admin@kupriyanov.com",
        "name": "users/118103361990877272029",
        "displayName": "Admin Kupriyanov.com",
        "type": "HUMAN",
        "avatarUrl": "https://lh6.googleusercontent.com/-2x1ObaBmpU8/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rc2l_g1xySO8lxjzpC1W9SJCuAeBA/photo.jpg"
    },
    "type": "CARD_CLICKED",
    "space": {
        "name": "spaces/AAAAX5_xtFM",
        "threaded": true,
        "displayName": "test room",
        "type": "ROOM"
    },
    "eventTime": {
        "seconds": 1581116275,
        "nanos": 497711000
    }
};

function test_updateAction() {
    const itemId = parseInt(event.action.parameters[0].value);
    const result = UI.updateVoteCardMessage(event.message.cards, event.user, itemId, true);
    console.log("result", result);
}