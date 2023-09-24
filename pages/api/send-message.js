import formidable from "formidable";
import sendEmail from "../../lib/mail";
import multer from "multer";
// import * as yup from "yup";

// let formSchema = yup.object().shape({
//   name: yup.string().required(),
//   email: yup.string().email().required(),
//   image: yup.mixed().required(),
// });

async function saveFormData(fields, files) {
  return await fetch( "http://smart/wordpress/wp-json/wp/v2/posts", {
    method: "POST",
    body: {

      date: new Date(),
      author: 1,
      slug: "",
      status: "publish",
      type: "post",
      title: {
        rendered: fields.title
      },
      content: {
        rendered:  fields.message,
      },

      format: "aside",
    }
  } )
    .then( response => {
      console.log(response);
      if( response.ok ) {
        console.log( "Новый пост добавлен" );
      } else {
        console.log( "Ошибка! Новый пост не добавлен" );
      }
    } )
    .catch( err => {
      console.log( "Ошибка: " + err );
    } );
  // save to persistent data store
  // console.log("This is a function saveFormData");
  // console.log(files);
}

//
// async function validateFromData(fields, files) {
//   try {
//     await formSchema.validate({ ...fields, ...files });
//     return true;
//   } catch (e) {
//     return false;
//   }
// }

async function handlePostFormReq(req, res) {
  const form = formidable( { multiples: true } );

  const formData = new Promise( (resolve, reject) => {
    form.parse( req, async(err, fields, files) => {
      if( err ) {
        reject( "error" );
      }
      resolve( { fields, files } );
    } );
  } );

  try {
    const { fields, files } = await formData;
    console.log( "fields and files" );
    console.log( fields );
    console.log( files );
    // const isValid = await validateFromData(fields, files);
    // if (!isValid) throw Error("invalid form schema");
    const sendMessage = {
      to: "ivakapet@mail.ru",   // email, куда будут отправляться сообщения
      subject: `Письмо с сайта Smart от ${ fields.name }`,
      text: `
        Имя: ${ fields.name },
        E-mail: ${ fields.email },
        Заголовок: ${ fields.title },
        Сообщение: ${ fields.message },
        Приоритет: ${ fields.priority }
        Прикрепленный файл: ${ fields.filename },       
        `,
      attachments: Object.keys( files ).length !== 0 ? files.files.map( item => {
        return {
          filename: item.originalFilename,
          path: item.filepath,
          contentType: item.mimetype,
        };
      } ) : null
    };

    try {
      await saveFormData( fields, files );
      await sendEmail( sendMessage );
      res.status( 200 ).send( { status: "submitted" } );
      return;
    } catch( e ) {
      res.status( 500 ).send( { status: "something went wrong" } );
      return;
    }
  } catch( e ) {
    res.status( 400 ).send( { status: "invalid submission" } );
    return;
  }
}

export default async function handler(req, res) {
  if( req.method === "POST" ) {
    await handlePostFormReq( req, res );
  } else {
    res.status( 404 ).send( "method not found" );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// **************************************************

// import sendEmail from "../../lib/mail";
//
// export default async function handler(req, res) {
//
//   if( req.method !== "POST" ) {
//     res.status( 400 ).send( { message: `${ req.method } not supported` } );
//     return;
//   }
//   console.log( "req.body: ")
//   console.log( req.body );
//   const formData = new FormData();
//   formData.getAll("data")
//   const { name, email, message, file } = req.body;
//   console.log("name, email, message, file");
//   console.log(name, email, message, file);
//
//   if( !name ) {
//     res.status( 422 ).json( { message: "Name error" } );
//     return;
//   } else if( !email ) {
//     res.status( 422 ).json( { message: "Email error" } );
//     return;
//   } else if( !message ) {
//     res.status( 422 ).json( { message: "Message error" } );
//     return;
//   }
//
//   const sendMessage = {
//     to: "video-rm@yandex.ru",   // email, куда будут отправляться сообщения
//     subject: `Письмо с сайта Smart от ${ req.body.name }`,
//     text: `
//       Имя: ${ name },
//       E-mail: ${ email },
//       Сообщение: ${ message },
//       Прикрепленный файл: ${ file },
// `,
//   };
//
//   await sendEmail( sendMessage );
//
//   res.send( `Thank you, ${ name }!` );
// }
