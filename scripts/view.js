export default class {
    render(templateName, data) {
        templateName = templateName + 'Template';
        // console.log(model);
        const templateElement = document.getElementById(templateName);
        const templateSource = templateElement.textContent;
        const renderFn = Handlebars.compile(templateSource);

        return renderFn(data);
    }

    renderFriends(friends, lists_size, isChosen){
        document.getElementById('chosenFriendsCount').textContent = lists_size.chosenFriends;
        document.getElementById('otherFriendsCount').textContent = lists_size.otherFriends;
        return this.render('friendItemList', {
            friends: friends,
            isChosen: isChosen
        })
    }

    moveFriendItem(item, list, lists_size, after){
        const actionBtn = item.querySelector('.vkf-modal__action');
        const currentList = item.closest('.vkf-modal__friends-list');
        const filter = list.closest('.vkf-modal__friends-area').querySelector('.vkf-modal__search-field');

        document.getElementById('chosenFriendsCount').textContent = lists_size.chosenFriends;
        document.getElementById('otherFriendsCount').textContent = lists_size.otherFriends;


        if(item.querySelector('.vkf-modal__item-name').textContent.toLowerCase().includes(filter.value.toLowerCase())){
            if (list.id === 'otherFriendsList') {
                actionBtn.classList.remove('vkf-modal__action_remove');
                actionBtn.classList.add('vkf-modal__action_add');
                actionBtn.firstChild.classList.remove('fa-times');
                actionBtn.firstChild.classList.add('fa-plus')
            } else {
                actionBtn.classList.remove('vkf-modal__action_add');
                actionBtn.classList.add('vkf-modal__action_remove');
                actionBtn.firstChild.classList.remove('fa-plus');
                actionBtn.firstChild.classList.add('fa-times')
            }

            if (after) {
                after.after(item)
            } else {
                if (list.querySelector('.vkf-modal__not-friends')) list.querySelector('.vkf-modal__not-friends').remove();

                list.prepend(item)
            }

        } else {
            item.remove()
        }

        if (!currentList.children.length) currentList.innerHTML = this.render('notFriends')
    }

    showConfirm(confirm, success){
        const confirmArea = document.getElementById('confirmArea');
        confirm.style.display = 'flex';
        confirm.innerHTML = this.render('confirm', success);
    }

    hideConfirm(confirm) {
        confirm.innerHTML = '';
        confirm.style.display = 'none';
    }
}