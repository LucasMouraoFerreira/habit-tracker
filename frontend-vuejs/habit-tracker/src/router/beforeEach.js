import store from '../store'

export default async (to, from, next) => {
    document.title = `Habits - ${to.name}`;

    if (to.name === 'Habits') {
        try {
            await store.dispatch('ActionCheckToken');

            next();
        } catch{
            next({ name: 'Home' });
        }
    } else {
        if (to.name === 'Home' && store.state.token) {
            next({ name: 'Habits'});
        } else if (to.name === 'Home' && !store.state.token) {
            try {
                await store.dispatch('ActionCheckToken');
              
                next({ name: 'Habits' });
            } catch{
                next();
            }
        } else {
            next();
        }
    }

}