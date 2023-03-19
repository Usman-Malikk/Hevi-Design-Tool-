export const errorHandler = (error) => {
    if (error.response) {
        if (error.response.status === 401) {
            // const token = localStorage.getItem('jwt')
            // if (token) {
            //     localStorage.clear()
            //     // window.location.reload()
            // }
        }
        return error.response.data.message;
    } else if (error.request) {
        return error.message;
    } else {
        return 'Something went wrong';
    }
};
