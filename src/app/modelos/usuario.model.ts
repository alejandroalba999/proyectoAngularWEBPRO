import Swal from "sweetalert2";

export class UsuarioModel {
    first_name?: String;
    middle_name?: String;
    last_name?: String;
    phone_number?: Number;
    city?: String;
    state?: String;
    email: String;
    password: String;
    password_confirmation: String;
    recovery_code?: String;
}

export class CorreoModel {
    email: String;
}

export class PinModel {
    email: String;
    recovery_code: String;
}