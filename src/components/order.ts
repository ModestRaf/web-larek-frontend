export class Order {
    private paymentMethod: string;
    private address: string;
    private email: string;
    private phone: string;

    constructor() {
        this.paymentMethod = 'card';
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    validateContactFields(email: string, phone: string): string {
        const emailValue = email.trim();
        const phoneValue = phone.trim();
        if (emailValue === '' && phoneValue === '') {
            return 'Необходимо ввести email и номер телефона';
        } else if (emailValue === '') {
            return 'Необходимо ввести email';
        } else if (phoneValue === '') {
            return 'Необходимо ввести номер телефона';
        }
        return '';
    }

    setPaymentMethod(method: string): void {
        this.paymentMethod = method;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    getPaymentMethod(): string {
        return this.paymentMethod;
    }

    getAddress(): string {
        return this.address;
    }

    getEmail(): string {
        return this.email;
    }

    getPhone(): string {
        return this.phone;
    }
}