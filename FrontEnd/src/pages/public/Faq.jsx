import { Container, Accordion } from 'react-bootstrap'

const faqs = [
  { q: '¿Qué es FuthurTech?', a: 'FuthurTech es una plataforma de educación en línea especializada en tecnología y robótica. Ofrecemos cursos autoasistidos y kits de robótica para todos los niveles.' },
  { q: '¿Necesito experiencia previa?', a: 'No. Tenemos cursos desde nivel inicial hasta avanzado. Cada curso indica los requisitos previos necesarios.' },
  { q: '¿Cómo son los cursos?', a: 'Son cursos 100% online y autoasistidos. Cada curso está dividido en módulos con lecciones en video, material teórico y ejercicios prácticos.' },
  { q: '¿Obtengo un certificado?', a: 'Sí. Al completar todas las lecciones de un curso, recibirás un certificado digital descargable con un código único de verificación.' },
  { q: '¿Cómo compro los kits de robótica?', a: 'Podés navegar nuestro catálogo de productos, agregarlos al carrito y realizar el pedido. Recibís el kit en tu domicilio.' },
  { q: '¿Cuáles son los medios de pago?', a: 'Aceptamos tarjetas de crédito, débito y transferencia bancaria. Los precios están expresados en pesos argentinos.' },
  { q: '¿Puedo ser instructor?', a: 'Sí. Si tenés experiencia en tecnología o robótica, contactanos para sumarte como instructor y crear tus propios cursos.' },
  { q: '¿Cómo contactarlos?', a: 'Podés usar nuestro formulario de contacto o escribirnos a info@futhurtech.com. Respondemos en menos de 24 horas hábiles.' },
]

function Faq() {
  return (
    <Container className="py-5">
      <h2 className="section-title">Preguntas Frecuentes</h2>
      <Accordion className="shadow-sm">
        {faqs.map((faq, i) => (
          <Accordion.Item eventKey={String(i)} key={i}>
            <Accordion.Header><strong>{faq.q}</strong></Accordion.Header>
            <Accordion.Body className="text-muted">{faq.a}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  )
}

export default Faq
