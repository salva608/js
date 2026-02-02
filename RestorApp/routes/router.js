import { render } from "../app.js";
import { login, loginLogic } from "../pages/login.js";
import { menu, menuLogic } from "../pages/menu.js";
import { profile } from "../pages/profile.js";
import { admin, adminLogic } from "../pages/admin.js";
import { getUser } from "../services/storage.js";


export async function router(){

    const hash = location.hash || "#/login";
    const user = getUser();

    switch (hash) {
        case '#/login':
            render(login())
            loginLogic()   
            break;
        case '#/menu':
            render(menu())
			menuLogic()
            break;
		case '#/profile':
			await profile()
			break;
        case '#/admin':
            if (user && user.role === 'admin') {
                render(admin())
                await adminLogic()
            } else {
                window.location.hash = '#/menu';
            }
            break;
        default:
            render(`404 error`)
            break;
    }
}