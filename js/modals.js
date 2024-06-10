class ModalManager {
    constructor() {
        this.modals = {};
    }

    registerModal(svgId, modalPath) {
        const svgElement = document.querySelector(`[data-modal="${svgId}"]`);

        if (svgElement) {
            svgElement.addEventListener('click', () => {
                this.showModal(modalPath, svgId);
            });

            this.modals[svgId] = modalPath;
        } else {
            console.error('Élément SVG introuvable.');
        }
    }

    showModal(modalPath, svgId) {
        let modalWrapper = document.getElementById('modal-wrapper');

        fetch(modalPath)
            .then(response => response.text())
            .then(content => {
                modalWrapper.innerHTML = content;
                document.querySelector(`#${modalWrapper.id} .close`).addEventListener('click', () => {
                    modalWrapper.style.display = 'none';
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement du contenu de la modal:', error);
            })
            .finally(() => {          
                switch (svgId) {
                    case 'options':
                        changeText(Cookies.get("background"));
                        break;
                    default:
                        break;
                }
            });
        
        modalWrapper.style.display = 'flex';
    }
}
const modalManager = new ModalManager();

modalManager.registerModal('informations', '/modals/informations.html');
modalManager.registerModal('options', '/modals/options.html');

