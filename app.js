const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')



const flujoPedido = addKeyword('domicilio').addAnswer(['Sigue este enlace para ver nuestro catálogo en WhatsApp: https://wa.me/c/573134190482','A continuación te preguntaremos los detalles de tu pedido 💌'])
    .addAnswer(['¿Qué deseas ordenar?', 'Recuerda escribir todos los productos que deseas ordenar en un solo mensaje'], { capture: true }, async (ctx, { state, flowDynamic }) => {
        const pedidoCapturado = ctx.body;
        console.log('Pedido capturado:', pedidoCapturado);
        await state.update({ pedido: pedidoCapturado });

    }).addAnswer(null, null, async (_, { flowDynamic, state }) => {
        const myState = state.getMyState()
        await flowDynamic(`Confirmación del pedido: \n${myState.pedido}`)
    }).addAnswer(['¿Confirmas tu pedido? Escribe *Si* o *No* de acuerdo a la opción que deseas escoger', 'Si ✅','No ❌'],{capture:true},async(ctx, {state, flowDynamic, gotoFlow}) => {

        console.log('...')

        if(ctx.body ==='No' || ctx.body ==='no'){
            await state.clear(['name', 'dir']);
            return gotoFlow(flujoPedido)
        }else if (ctx.body ==='Si'|| ctx.body ==='si'){
            await flowDynamic(`Productos registrados`)
            return gotoFlow(flujoDatosPedido)
        }

    })


const checkMessageLength = (message) => {
    const maxLength = 160; // Establece la longitud máxima del mensaje

    if (message.length > maxLength) {
        return true; // El mensaje es demasiado largo
    } else {
        return false; // El mensaje es aceptable
    }
};

/*

const flujoDatosPedido = addKeyword(['Si', 'si', 'SI'])

    .addAnswer('¿Cual es tu nombre?', { capture: true }, async (ctx, { state, flowDynamic, fallBack }) => {
        const nombreCapturado = ctx.body;
        const regexNombreCompleto = /^[A-Za-z\s']+$/;

        // Verifica la longitud del mensaje
        if (regexNombreCompleto.test(nombreCapturado)) {
            console.log('Nombre capturado:', nombreCapturado);
            await state.update({ name: nombreCapturado });
        } else {
            return fallBack()
        }

    })
    .addAnswer('¿Cual es tu direccion?', { capture: true }, async (ctx, { state, flowDynamic, fallBack }) => {
        const direccionCapturada = ctx.body;
        const regexDireccion = /^[A-Za-z0-9\s#.,-]+$/;

        if(regexDireccion.test(direccionCapturada)){
            console.log('Dirección capturada:', direccionCapturada);
            await state.update({ dir: direccionCapturada });
        }else{
            return fallBack()
        }

    }).addAnswer('Número de teléfono de la persona que recibe el domicilio', { capture: true }, async (ctx, { state, flowDynamic, fallBack }) => {
        const telCapturado = ctx.body;
        const regex = /^[0-9]+$/;

        if (regex.test(telCapturado)){
            console.log('Telefono capturadao:', telCapturado);
            await state.update({ tel: telCapturado });
        }else{
            return fallBack()
        }

    })
    .addAnswer('Tus datos son:', null, async (_, { flowDynamic, state }) => {
        const myState = state.getMyState()
        await flowDynamic(`Nombre: ${myState.name} \nDirección: ${myState.dir} \nTeléfono: ${myState.tel}`)
    }).addAnswer(['¿Confirmas tus datos? Escribe *Si* o *No* dependiendo la opción que deseas escoger', 'Si ✅','No ❌'],{capture:true},async(ctx, {state, flowDynamic, gotoFlow}) => {

        console.log('...')


        if(ctx.body ==='No' || ctx.body ==='no'){
            await state.clear(['name', 'dir']);
            return gotoFlow(flujoDatosPedido)
        }else if (ctx.body ==='Si'|| ctx.body ==='si'){
            return gotoFlow(flujoConfirmacion)
        }

    })

 */


const flujoDatosPedido = addKeyword(["Si",'si'], { sensitive: true })
    .addAnswer(
        "¿Cual es tu nombre?",
        { capture: true },
        async (ctx, { state }) => {
            await state.update({ name: ctx.body });
        }
    )
    .addAnswer(
        "¿Dirección?",
        { capture: true },
        async (ctx, { state }) => {
            await state.update({ direccion: ctx.body });
        }
    )
    .addAnswer(
        "Número de teléfono de la persona que recibe el domicilio",
        { capture: true },
        async (ctx, { state }) => {
            const telCapturado = ctx.body;
            const regex = /^[0-9]+$/;

            if (regex.test(telCapturado)){
                console.log('Telefono capturadao:', telCapturado);
                await state.update({ tel: telCapturado });
            }else{
                return fallBack()
            }
        }
    )
    .addAnswer('Productos de tu orden:', null, async (_, { flowDynamic, state }) => {
        const myState = state.getMyState()
        await flowDynamic(`\n ${myState.pedido} \n \n📖Datos Domicilio: \nNombre: ${myState.name} \nDirección: ${myState.direccion} \nTeléfono: ${myState.tel}`)
    }).addAnswer(['¿Confirmas tus datos? Escribe *Si* o *No* dependiendo la opción que deseas escoger', 'Si ✅','No ❌'],{capture:true},async(ctx, {state, flowDynamic, gotoFlow}) => {

        console.log('...')


        if(ctx.body ==='No' || ctx.body ==='no'){
            await state.clear(['name', 'dir']);
            return gotoFlow(flujoDatosPedido)
        }else if (ctx.body ==='Si'|| ctx.body ==='si'){
            await flowDynamic("Pedido Realizado, si sucede cualquier inconveniente te escribira un asesor")
            return  gotoFlow(atentoDomicilio)
        }

    })








const atentoDomicilio = addKeyword('salida').addAnswer('¡Muchas gracias! Ten lindo día, recuerda estar atento a tu domiclio',{capture:true},async(ctx, {state, flowDynamic, gotoFlow}) => {

})




const flowMenu = addKeyword(['Hola','Buenos días', 'Buenas', '¿Cómo estás?', 'Saludos', '¡Hola, bot!',
    'Hola, ¿estás ahí?', 'Iniciar conversación', 'Empezar chat', '¿Qué tal?', 'Hey', '¿Hola, qué haces?', 'Buen día',
    'Buenas tardes', 'Buenas noches', 'Hello', 'Hi', '¿Hay alguien?', '¿Puedo preguntar algo?',
    'Hola, ¿me puedes ayudar?', 'buenas', 'hola']).addAnswer('🙌 Hola bienvenido a la Freseria🍓').addAnswer(
    [
        'Escribe un mensaje con el número de la opción que desees:',
        '👉 *A*  Domicilios',
        '👉 *B*  Recoger pedido en tienda',
        '👉 *C*  Regalos',

    ], {capture:true}, async(ctx, {flowDynamic, gotoFlow}) =>{
        const opcion = ctx.body
        console.log(opcion)
        if (opcion === 'A' || opcion === 'a' || opcion === 'Domicilios' || opcion === 'domicilios'){
            return gotoFlow(flujoPedido);
        }
        else if(opcion === 'B' || opcion === 'b'){

        }
        else if(opcion === 'C' || opcion === 'c'){

        }

    }
)




const main = async () => {
    const adapterDB = new MockAdapter();
    const adapterFlow = createFlow([flujoDatosPedido, flujoPedido,atentoDomicilio,flowMenu]);
    const adapterProvider = createProvider(BaileysProvider);

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });


    QRPortalWeb();
};

main();


