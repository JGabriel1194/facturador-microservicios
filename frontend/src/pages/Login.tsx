import React from 'react';
import { Button, Label, TextInput } from 'flowbite-react';

const Login: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Iniciar sesión</h2>
                <form className="space-y-6" action="#" method="POST">
                    <div>
                        <Label htmlFor="email" value="Email" />
                        <TextInput id="email" type="email" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <Label htmlFor="password" value="Contraseña" />
                        <TextInput id="password" type="password" placeholder="••••••••" required />
                    </div>
                    <Button type="submit" className="w-full">
                        Iniciar sesión
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Login;