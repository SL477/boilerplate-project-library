/**
 * @param formID{string}
 * @returns {object}
 */
function getFormData(formID) {
    // eslint-disable-next-line no-undef
    const formElement = document.getElementById(formID);
    if (formElement) {
        const data = new FormData(formElement);
        return Object.fromEntries(data);
    }
    return {};
}

/**
 * Post a comment
 */
// eslint-disable-next-line no-unused-vars
function commentTestFunc() {
    const commentData = getFormData('commentTest');
    if (commentData['id'] && commentData['comment']) {
        fetch('/api/books/' + commentData['id'], {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ comment: commentData['comment'] }),
            // eslint-disable-next-line no-undef
        }).then(document.location.reload());
    }
    return false;
}

let itemsRaw = [];
let items = [];

fetch('/api/books')
    .then((data) => data.json())
    .then((data) => {
        itemsRaw = data;
        items = data.map((val, i) => {
            if (i < 14) {
                return `<li class="bookItem" id="${i}" onclick="bookItemClick('${i}')">${val.title} - ${val.commentcount} comments</li>`;
            } else if (i === 15) {
                return `<p>...and ${data.length - 15} more!</p>`;
            } else {
                return '';
            }
        });

        // eslint-disable-next-line no-undef
        const display = document.getElementById('display');
        display.innerHTML =
            '<ul class="listWrapper">' + items.join('') + '</ul>';
    });

let comments = [];
// eslint-disable-next-line no-unused-vars
function bookItemClick(id) {
    // eslint-disable-next-line no-undef
    const detailTitle = document.getElementById('detailTitle');
    detailTitle.innerHTML = `<b>${itemsRaw[id].title}</b> (id: ${itemsRaw[id]._id})`;

    fetch('/api/books/' + itemsRaw[id]._id)
        .then((data) => data.json())
        .then((data) => {
            console.log(data);
            comments = data.comments.map((val) => {
                if (val) {
                    return `<li>${val}</li>`;
                }
                return '';
            });
            comments.push(
                '<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>'
            );
            comments.push(
                `<br><button class="btn btn-info addComment" id="${data._id}" onclick="addCommentClick('${data._id}')">Add Comment</button>`
            );
            comments.push(
                `<button class="btn btn-danger deleteBook" id="${data._id}" onclick="deleteBookClick('${data._id}')">Delete Book</button>`
            );
            // eslint-disable-next-line no-undef
            const detailComments = document.getElementById('detailComments');
            detailComments.innerHTML = comments.join('');
        });
}

// eslint-disable-next-line no-unused-vars
function deleteBookClick(id) {
    fetch('/api/books/' + id, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((data) => data.text())
        .then((data) => {
            // update list
            // eslint-disable-next-line no-undef
            const detailComments = document.getElementById('detailComments');
            detailComments.innerHTML = `<p style="color: red;">${data}<p><p>Refresh the page</p>`;
        });
}

// eslint-disable-next-line no-unused-vars
function addCommentClick(id) {
    // eslint-disable-next-line no-undef
    const commentToAdd = document.getElementById('commentToAdd');
    const newComment = commentToAdd.value;
    fetch('/api/books/' + id, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(getFormData('newCommentForm')),
    }).then(() => {
        comments.unshift(newComment); // adds new comment to top of list
        // eslint-disable-next-line no-undef
        const detailComments = document.getElementById('detailComments');
        detailComments.innerHTML = comments.join('');
    });
}

// eslint-disable-next-line no-unused-vars
function newBookFormFunc() {
    fetch('/api/books', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(getFormData('newBookForm')),
        // eslint-disable-next-line no-undef
    }).then(document.location.reload());
    return false;
}

// eslint-disable-next-line no-unused-vars
function deleteAllBooks() {
    fetch('/api/books', {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        // eslint-disable-next-line no-undef
    }).then(document.location.reload());
}
