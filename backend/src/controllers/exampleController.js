
exports.showSubStuff = async (req, res) => {
    console.log("sub stuff")
    res.json({message: "sub stuff!"})
}

exports.printId = async (req, res) => {
    if (req.params?.id) {
        console.log("The provided id is: " + req.params.id);
        res.json({message: `You sent me the id: ${req.params.id}!`})
    }
}