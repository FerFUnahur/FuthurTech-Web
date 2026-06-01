const { Certificate, User, Course } = require('../models');
const PDFDocument = require('pdfkit');

exports.getMyCertificates = async (req, res) => {
  const certs = await Certificate.findAll({
    where: { userId: req.user.id },
    include: [Course],
    order: [['createdAt', 'DESC']],
  });
  res.json(certs);
};

exports.getAll = async (req, res) => {
  const certs = await Certificate.findAll({
    include: [User, Course],
    order: [['createdAt', 'DESC']],
  });
  res.json(certs);
};

exports.downloadPDF = async (req, res) => {
  const cert = await Certificate.findByPk(req.params.id, {
    include: [User, Course],
  });
  if (!cert) return res.status(404).json({ error: 'Certificado no encontrado' });
  if (req.user.role !== 'admin' && cert.userId !== req.user.id) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=certificado-${cert.code}.pdf`);
  doc.pipe(res);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  const border = 20;
  doc.rect(border, border, pageWidth - 2 * border, pageHeight - 2 * border).stroke('#0047AB');
  doc.rect(border + 5, border + 5, pageWidth - 2 * border - 10, pageHeight - 2 * border - 10).stroke('#00A859');

  doc.fontSize(36).font('Helvetica-Bold').fillColor('#0047AB')
    .text('FuthurTech', { align: 'center', valign: 'center' });

  doc.moveDown(1);
  doc.fontSize(20).font('Helvetica').fillColor('#333')
    .text('Certificado de Finalización', { align: 'center' });

  doc.moveDown(1.5);
  doc.fontSize(14).fillColor('#666').text('Otorgado a:', { align: 'center' });

  doc.moveDown(0.5);
  doc.fontSize(28).font('Helvetica-Bold').fillColor('#00A859')
    .text(cert.User.name, { align: 'center' });

  doc.moveDown(1.5);
  doc.fontSize(16).font('Helvetica').fillColor('#333')
    .text(`Por haber completado satisfactoriamente el curso:`, { align: 'center' });

  doc.moveDown(0.5);
  doc.fontSize(22).font('Helvetica-Bold').fillColor('#0047AB')
    .text(cert.Course.title, { align: 'center' });

  doc.moveDown(2);
  doc.fontSize(12).font('Helvetica').fillColor('#999')
    .text(`Código de verificación: ${cert.code}`, { align: 'center' });

  doc.moveDown(0.5);
  doc.text(`Emitido el: ${new Date(cert.createdAt).toLocaleDateString('es-AR')}`, { align: 'center' });

  doc.end();
};
