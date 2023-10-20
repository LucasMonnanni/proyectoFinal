const login = async (req, res) => { 
    delete req.user.password;
    req.session.user = req.user;
    res.redirect('/products')
}

const register = async (req, res) => {
    delete req.user.password;
    req.session.user = req.user;
    res.redirect('/products')
}

const logout = async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.status(500).send({ status: 'Error' })
            return
        }
        res.redirect('/login')
    })
}

const githubCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products/')
}

const getCurrent = async (req, res) => {
    try{
        if (!req.session.user) {
            res.status(401).send({ status: 'Error', error: "Not logged in" })
            return
        }
        delete req.session.user.passwordHash
        res.send({ status: 'Success', payload: req.session.user });
    } catch(error){
        console.log(error)
        res.status(500).send({ status: 'Error'});
    }
}

export default {
    login, 
    register,
    logout,
    githubCallback,
    getCurrent
}