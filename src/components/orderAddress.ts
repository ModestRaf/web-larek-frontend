import {IOrderModel} from "../types";

export class OrderView {
    private contentTemplate: HTMLTemplateElement;
    private orderElement: HTMLElement;
    private paymentButtons: NodeListOf<HTMLButtonElement>;
    private addressField: HTMLInputElement;
    private nextButton: HTMLButtonElement;
    private formErrors: HTMLElement;
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
        formSubmitHandler: (event: Event) => void,
    ) {
        this.contentTemplate = document.querySelector(`#${contentTemplateId}`) as HTMLTemplateElement;
        const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
        const orderClone = document.importNode(orderTemplate.content, true);
        this.orderElement = orderClone.firstElementChild as HTMLElement;
        this.paymentButtons = this.orderElement.querySelectorAll('.order__buttons .button_alt');
        this.addressField = this.orderElement.querySelector('input[name="address"]') as HTMLInputElement;
        this.nextButton = this.orderElement.querySelector('.order__button') as HTMLButtonElement;
        this.formErrors = this.orderElement.querySelector('.form__errors') as HTMLElement;
        this.model = model;
        this.openContactsModal = openContactsModal;
        this.onSuccess = onSuccess;
        this.formSubmitHandler = formSubmitHandler;
        this.setupPaymentButtons();
        this.setupAddressField();
        this.setupNextButton();
    }

    render(): HTMLElement {
        return this.orderElement;
    }

    private setupPaymentButtons(): void {
        this.paymentButtons.forEach(button => {
            if (button.getAttribute('name') === 'card') {
                button.classList.add('button_alt-active');
                this.selectedPaymentMethod = 'card';
                this.model.setPaymentMethod(this.selectedPaymentMethod);
            }
            button.addEventListener('click', (event) => {
                const selectedButton = event.currentTarget as HTMLButtonElement;
                const paymentMethod = selectedButton.getAttribute('name');
                this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
                selectedButton.classList.add('button_alt-active');
                this.selectedPaymentMethod = paymentMethod;
                this.model.setPaymentMethod(this.selectedPaymentMethod);
            });
        });
    }

    private setupAddressField(): void {
        this.addressField.addEventListener('input', () => {
            this.model.validateAddressField(this.addressField, this.nextButton, this.formErrors);
            this.model.setAddress(this.addressField.value);
        });
    }

    private setupNextButton(): void {
        this.nextButton.addEventListener('click', () => {
            if (this.model.validateAddressField(this.addressField, this.nextButton, this.formErrors)) {
                this.openContactsModal();
                this.onSuccess();
            }
        });
    }
}