const users = [
{
    id: 1,
    name: 'Fellipe',
    schoolId: 101
},
{
    id: 2,
    name: 'Tenorio',
    schoolId: 202
},
{
    id: 3,
    name: 'Joao',
    schoolId: 333
},
];

const grades = [
    {
        id: 1,
        schoolId: 101,
        grade: 86
    },
    {
        id: 2,
        schoolId: 202,
        grade: 100
    },
    {
        id: 3,
        schoolId: 101,
        grade: 90
    },
];

const getUser = id => {
    return new Promise((resolve, reject) => {
        const user = users.find(u => u.id === id);

        if(user)
            return resolve(user);
        reject('unable to find user');
    });
};

const getGrades = schoolId => {
    return new Promise((resolve, reject) => {
        resolve(grades.filter(u => u.schoolId === schoolId));
    });
};

// User has a 83% in the class
const getStatus = userId => {
    let user;
    return getUser(userId)
            .then(mUser => {
                user = mUser;
                return getGrades(user.schoolId)
            })
            .then(grades => {
                let average = 0;

                if(grades.length > 0) 
                    average = grades.map(g => g.grade).reduce((a, b) => a+b)/grades.length;

                return `${user.name} has a ${average}% in the class.`;
            })
            .catch(err => err);
}
// getStatus(3)
// .then(status => console.log(status))
// .catch(err => console.log('err', err));

/*
// async await
const getStatusAlt = async  userId => {
    
    return 'Mike';
}
// identical to:
// () => {
//     return new Promise((resolve, reject) => {
//         resolve('Mike')
//     });
// }

// console.log(getStatusAlt()); // Promise { 'Mike' }
getStatusAlt().then(s => console.log(s));

const getStatusAltE = async  userId => {
    throw new Error('this is an error');
    return 'Mike';
}
// identical to:
// () => {
//     return new Promise((resolve, reject) => {
//         reject('this is an error')
//     });
// }
getStatusAltE().then(s => console.log(s)).catch(e => console.log('error', e));
*/

getStatusAlt = async (userId) => {
    const user = await getUser(userId);
    const grades = await getGrades(user.schoolId);

    if(grades.length > 0) 
        average = grades.map(g => g.grade).reduce((a, b) => a+b)/grades.length;

    return `${user.name} has a ${average}% in the class.`;
}

getStatusAlt(1)
.then(u => console.log(u))
.catch(e => console.log('error', e));
