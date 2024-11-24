import {IOrderModel} from "../types";

export class OrderView {
    private contentTemplate: HTMLTemplateElement;
    private orderTemplate: HTMLTemplateElement;
    private model: IOrderModel;
    private selectedPaymentMethod: string;
    public formSubmitHandler: (event: Event) => void;
    private readonly openContactsModal: () => void;
    private readonly onSuccess: () => void;

    constructor(
        contentTemplateId: string,
        model: IOrderModel,
        openContactsModal: () => void,
        onSuccess: () => void,
        formSubmitHandler: (event: Event) => void
    ) {
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        this.orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
        this.model = model;
        this.openContactsModal = openContactsModal;
        this.onSuccess = onSuccess;
        this.selectedPaymentMethod = 'card';
        this.formSubmitHandler = formSubmitHandler;
    }

    render(): HTMLElement {
        const orderClone = document.importNode(this.orderTemplate.content, true);
        const orderElement = orderClone.firstElementChild as HTMLElement;
        this.setupPaymentButtons(orderElement);
        this.setupAddressField(orderElement);
        const onlineButton = orderElement.querySelector('button[name="card"]') as HTMLButtonElement;
        onlineButton.classList.add('button_alt-active');
        this.setupNextButton(orderElement);
        return orderElement;
    }

    setupPaymentButtons(orderElement: HTMLElement): void {
        const paymentButtons = orderElement.querySelectorAll('.order__buttons .button_alt');
        paymentButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                const selectedButton = event.target as HTMLElement;
                selectedButton.classList.add('button_alt-active');
                this.selectedPaymentMethod = selectedButton.getAttribute('name');
                this.model.setPaymentMethod(this.selectedPaymentMethod);
            });
        });
    }

    setupAddressField(orderElement: HTMLElement): void {
        const addressField = orderElement.querySelector('input[name="address"]') as HTMLInputElement;
        const nextButton = orderElement.querySelector('.order__button') as HTMLButtonElement;
        const formErrors = orderElement.querySelector('.form__errors') as HTMLElement;
        addressField.addEventListener('input', () => {
            this.model.validateAddressField(addressField, nextButton, formErrors);
            this.model.setAddress(addressField.value);
        });
    }

    setupNextButton(orderElement: HTMLElement): void {
        const nextButton = orderElement.querySelector('.order__button') as HTMLButtonElement;
        const addressField = orderElement.querySelector('input[name="address"]') as HTMLInputElement;
        const formErrors = orderElement.querySelector('.form__errors') as HTMLElement;
        nextButton.addEventListener('click', () => {
            if (this.model.validateAddressField(addressField, nextButton, formErrors)) {
                this.openContactsModal();
                this.onSuccess();
            }
        });
    }
}