import Model from './model.js'
import View from './view.js'

const model = new Model();
const view = new View();

export default class {
    async init() {
        const chosenFriends = [], 
            otherFriends = [];

        const otherFriendsList = document.querySelector('#otherFriendsList');
        const chosenFriendsList = document.querySelector('#chosenFriendsList');
        const vkModalWindow = document.querySelector('#vkModal');

        await model.login(7369931, 2);

        const VKFriends = await model.getVKFriends({
            fields: 'photo_50'
        });

        VKFriends.items
            .forEach(friend => {
                if (model.getChosenFriends().includes(friend.id)){
                    chosenFriends.push(friend)
                } else {
                    otherFriends.push(friend)
                }
            });

        otherFriends.sort(sortFriends);
        chosenFriends.sort(sortFriends);

        otherFriendsList.innerHTML = view.renderFriends(otherFriends, getListsSizes());
        chosenFriendsList.innerHTML = chosenFriends.length?view.renderFriends(chosenFriends, getListsSizes(), true):view.render('notFriends');

        vkModalWindow.addEventListener('keyup', e=>{
            const friendsElement = e.target.closest('.vkf-modal__friends-area').querySelector('.vkf-modal__friends-list');
            const friendList = (friendsElement.id === 'otherFriendsList')?otherFriends:chosenFriends;
            friendList.sort(sortFriends);
            const filterFriendList = friendList.filter(friend=>friend.first_name.toLowerCase().includes(e.target.value.toLowerCase()) || friend.last_name.includes(e.target.value))

            friendsElement.innerHTML = filterFriendList.length?view.renderFriends(filterFriendList, getListsSizes(),  (friendsElement.id === 'otherFriendsList')?false:true):view.render('notFriends');
        });

        vkModalWindow.addEventListener('click', e => {
            if (e.target.closest('.vkf-modal__action_add') || e.target.closest('.vkf-modal__action_remove')){
                const el = e.target.closest('.vkf-modal__friends-item');
                const targetList = el.parentNode.id === 'otherFriendsList'?document.getElementById('chosenFriendsList'):document.getElementById('otherFriendsList');
                
                updateFriendLists(el);
                view.moveFriendItem(el, targetList, getListsSizes());
            }
            
        });

        vkModalWindow.addEventListener('dragstart', e=>{
            // console.log(e.target);
            const el = e.target.closest('.vkf-modal__friends-item');
            e.dataTransfer.setData("Text", el.dataset.friend);
        }, true)

        vkModalWindow.addEventListener('dragover', e=>{
            e.preventDefault();
            e.stopPropagation()
        }, true)

        vkModalWindow.addEventListener('drop', e=>{
            // console.log(e.target);
            const targetElem = vkModalWindow.querySelector(`[data-friend="${e.dataTransfer.getData('Text')}"`);
            if (e.target.closest('.vkf-modal__friends-list').id !== targetElem.parentNode.id) {
                updateFriendLists(targetElem);

                if (e.target.closest('.vkf-modal__friends-item')) {
                    view.moveFriendItem(targetElem, e.target.closest('.vkf-modal__friends-list'), getListsSizes(), e.target.closest('.vkf-modal__friends-item'));
                } else if (e.target.closest('.vkf-modal__friends-list')) {
                    view.moveFriendItem(targetElem, e.target.closest('.vkf-modal__friends-list'), getListsSizes());
                }                                     
            }
        }, true);

        document.getElementById('saveBtn').addEventListener('click', ()=>{
            const confirmArea = document.getElementById('confirmArea');
            view.showConfirm(confirmArea);

            confirmArea.querySelector('.vkf-modal__save-button').addEventListener('click', ()=>{
                model.saveChosenFriends(chosenFriends.map(friend=>friend.id))
                view.hideConfirm(confirmArea);
                setTimeout(()=>{
                    view.showConfirm(confirmArea, true);
                    confirmArea.querySelector('.vkf-modal__close').addEventListener('click', ()=>{
                        view.hideConfirm(confirmArea)
                    });
                    confirmArea.querySelector('.vkf-modal__save-button').addEventListener('click', ()=>{
                        view.hideConfirm(confirmArea)
                    })
                }, 500)
            });

            confirmArea.querySelector('.vkf-modal__cuncel-button').addEventListener('click', ()=>{
                view.hideConfirm(confirmArea)
            });

            confirmArea.querySelector('.vkf-modal__close').addEventListener('click', ()=>{
                view.hideConfirm(confirmArea)
            })
        })


        function updateFriendLists(item){
            let changedFriend = null;
            
            if (item.parentNode.id === 'otherFriendsList') {
                changedFriend = otherFriends.find(friend=>friend.id == item.dataset.friend);
                chosenFriends.push(otherFriends.splice(otherFriends.indexOf(changedFriend), 1)[0]);
            } else {
                changedFriend = chosenFriends.find(friend=>friend.id == item.dataset.friend);
                otherFriends.push(chosenFriends.splice(chosenFriends.indexOf(changedFriend), 1)[0]);
            }
        }

        function getListsSizes(){
            return {
                otherFriends: otherFriends.length,
                chosenFriends: chosenFriends.length
            }
        }

        function sortFriends(a, b){
            if (a.last_name > b.last_name) {
                return 1;
            }

            if (a.last_name < b.last_name) {
                return -1;
            }

            return 0;
        }
    }

}