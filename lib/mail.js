import mailer from "nodemailer";

const smtpTransport = mailer.createTransport( {
  host: "smtp.mail.ru",  // нужно настроить в зависимости от почтового клиента
  port: 465,   // нужно настроить в зависимости от почтового клиента — порт SMTP
  secure: true,
  auth: {
    user: "ivakapet@mail.ru", // С какого email будет отправляться письмо
    pass: "H6Tpyuxk6NYvCVpCQmkb"   // Пароль от почты
  },
  tls: { rejectUnauthorized: false },
}, {
  from: "<ivakapet@mail.ru>" // Что будет написано в поле «От кого»
} );

const sendEmail = async (message) => {
  await smtpTransport.sendMail( message, function(error, info) {
    if( error ) {
      console.log( "Ошибка - " + error );

    } else {
      console.log( "Email sent successfully", info );
    }
    smtpTransport.close();
  } );
};

export default sendEmail;

