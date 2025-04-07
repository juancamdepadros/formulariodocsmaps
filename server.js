require('dotenv').config();
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Cargado ✅' : 'No cargado ❌');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors()); 

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-email', async (req, res) => {
    console.log('🔹 Headers:', req.headers);  
    console.log('🔹 Body recibido:', JSON.stringify(req.body, null, 2));  
    const { nombre, apellido, email, telefono, redes, especialidad, profesion, estudio, horarios, pais, estado, calle, numero, codigo_postal, mensaje, proexp, consultorios } = req.body;

    const listaConsultorios = Array.isArray(consultorios) ? consultorios : [];

    if (!nombre || !apellido || !email || !telefono || !redes || !especialidad || !profesion || !estudio || !horarios || !pais || !estado || !calle || !numero || !codigo_postal || !mensaje || !proexp) {
        console.log('❌ ERROR: El body está vacío o con undefined');
        return res.status(400).json({ message: 'Datos incompletos' });
    }

    console.log('✅ Datos de los consultorios recibidos:', listaConsultorios);

    let mailText = `
       📩 Nuevo mensaje de contacto
    
       🔹 Nombre: ${nombre}
       🔹 Apellido: ${apellido}
       🔹 Correo electrónico: ${email}
       🔹 Teléfono/Celular: ${telefono}
       🔹 Redes Sociales: ${redes}
       🔹 Especialidad: ${especialidad}
       🔹 Profesión: ${profesion}
       🔹 Universidad: ${estudio}
       🔹 Experiencia Profesional: ${proexp}
       🔹 Mensaje: ${mensaje}
    `;

    // ASI PROLIJITO PAPAAAAAA

    // Consultorios adicionales (no se bugeen nunca plis)
    listaConsultorios.forEach((consultorio, index) => {
        mailText += `
        🏥 Consultorio ${index + 1}:  
        🔹 Horarios: ${consultorio.horarios || 'No especificado'}
        🔹 País: ${consultorio.pais || 'No especificado'}
        🔹 Estado/Provincia: ${consultorio.estado || 'No especificado'}
        🔹 Calle: ${consultorio.calle || 'No especificado'} - Número: ${consultorio.numero || 'No especificado'}
        🔹 Código Postal: ${consultorio.codigo_postal || 'No especificado'}
        `;
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Nuevo Mensaje del Formulario',
        text: mailText
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado con éxito');
        res.json({ message: 'Correo enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo', error });
    }
});


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});