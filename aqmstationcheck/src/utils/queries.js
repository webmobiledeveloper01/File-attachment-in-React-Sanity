export const userQuery = (userId) => {
    const query = `*[_type == "user" && _id=='${userId}']{
        userName,
        image{
            asset->{
              url
            }
        },
        status,
        _id
    }`
    return query;
};

export const getUsersEmailQuery = () => {
    const query =`*[_type == "user"]{email}`;
    return query;
}

export const getEmailQuery = (email) => {
    const query =`*[_type == "user" && email == '${email}']`;
    return query;
}

export const getFiles = (type) => {
    const query =`*[_type== "${type}" ] | order(_createdAt asc)`
    return query;
}

export const catchSiteDocs = (site_id) => {
    const query = `*[_type=="stationFile" && stationID =='${site_id}'] | order(_createdAt asc)`
    return query;
}