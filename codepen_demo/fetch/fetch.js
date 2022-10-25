// User Data Class
class Users {
    constructor(url) {
        this.url = url;
    }
  
    async fetchData(fetchFunc) {
        this.data = await fetchFunc(this.url);
    }
  
    forEach(callback) {
        return this.data.data.forEach(callback);
    }
}

// Fetch Data
async function fetchData(url) {
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

// Render Data
async function renderUsers(users) {
    let html = '';
    users.forEach(user => {
        let htmlSegment = `<div class="user">
                            <img src="${user.avatar}" >
                            <h2>${user.first_name} ${user.last_name}</h2>
                            <div class="email"><a href="email:${user.email}">${user.email}</a></div>
                        </div>`;

        html += htmlSegment;
    });

    let container = document.querySelector('.container');
    container.innerHTML = html;
}
 
// Main Function
async function main() {
    let users = new Users('https://reqres.in/api/users');
    await users.fetchData(fetchData);
    renderUsers(users);
}

main()