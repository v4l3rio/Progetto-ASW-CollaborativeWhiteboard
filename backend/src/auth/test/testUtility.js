const {logErr, log} = require("../../util/consoleUtil");
const {auth} = require("../../controllers/authController");
const {TestModel} = require("../../models/testModel");

exports.createTestEnvironment = () => {
    auth.register({first_name: "Admin", last_name: "Admin", username: "admin@admin.com", password: "admin"})
        .then((result) => {
            if (result.err) {
                logErr("Error: " + result.err)
            } else {
                const created = result.user;
                const noPasswordUser = {
                    id: created.id, username: created.username,
                    first_name: created.first_name, last_name: created.last_name
                };
                log("Created user " + JSON.stringify(noPasswordUser));

                auth.login({username: "admin@admin.com", password: "admin"})
                    .then((result) => {
                        if (result.err) {
                            logErr("Error: " + result.err)
                        } else {
                            const logged = result.user;
                            const noPasswordUser = {id: logged.id, username: logged.username};

                            log("Logged user " + JSON.stringify(noPasswordUser));
                            log(`Access Token: ${logged.accessToken}`);

                            if (process.env.TEST_WHITEBOARD === "yes") {
                                auth.validateAccessToken(logged.accessToken).then(result => {
                                    if (result.err) {
                                        logErr("Invalid Access Token");
                                    } else {
                                        if (result.user) {
                                            const whiteboardName = "Test Whiteboard"
                                            TestModel.createWhiteboard(whiteboardName, result.user.username).then(result => {
                                                if (result) {
                                                     log(`Whiteboard created successfully, ID:${result.id}`);
                                                } else {
                                                    logErr("Test ERROR")
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }

                    });
            }

        });
}


