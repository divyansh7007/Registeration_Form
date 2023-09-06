

const emailChecker = async (req, res, email) => {
    // emailPattern 
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    console.log(emailPattern.test(email));
}

export default emailChecker;