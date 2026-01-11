// src/controllers/pdfController.js
import prisma from "../utils/prisma.js";
import puppeteer from "puppeteer";

export const generateLaporanPDF = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Ambil Data Lengkap
    const data = await prisma.pengaduan.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { nama_lengkap: true, nik: true, no_hp: true } },
        kategori: { select: { nama_kategori: true } },
      },
    });

    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    // 2. Format Tanggal
    const tanggalLapor = new Date(data.createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // 3. Template HTML Laporan (Style Surat Resmi)
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; color: #000; }
          .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px; }
          .header h2 { margin: 0; font-size: 22px; text-transform: uppercase; }
          .header p { margin: 5px 0 0; font-size: 14px; }
          
          .title { text-align: center; margin: 30px 0; text-decoration: underline; font-weight: bold; font-size: 18px; }
          
          .content { margin-left: 20px; font-size: 12pt; }
          .row { margin-bottom: 12px; display: flex; }
          .label { width: 180px; font-weight: bold; }
          .value { flex: 1; }
          
          .deskripsi-box {
            margin-top: 10px;
            border: 1px solid #ccc;
            padding: 10px;
            min-height: 100px;
            background-color: #f9f9f9;
          }

          .footer { margin-top: 60px; text-align: right; padding-right: 50px; }
          .ttd-area { height: 80px; }
        </style>
      </head>
      <body>
        
        <div class="header">
          <h2>SISTEM PENGADUAN MASYARAKAT</h2>
          <p>LAPORPAK - Layanan Aspirasi dan Pengaduan Online Rakyat</p>
        </div>

        <div class="title">BERITA ACARA PENGADUAN</div>

        <div class="content">
          <div class="row">
            <div class="label">ID Laporan</div>
            <div class="value">: #LP-${data.id}</div>
          </div>
          <div class="row">
            <div class="label">Tanggal Lapor</div>
            <div class="value">: ${tanggalLapor}</div>
          </div>
          <div class="row">
            <div class="label">Status Terakhir</div>
            <div class="value">: <strong style="text-transform:uppercase">${data.status}</strong></div>
          </div>

          <br/>

          <div class="row">
            <div class="label">Nama Pelapor</div>
            <div class="value">: ${data.user?.nama_lengkap || "-"}</div>
          </div>
          <div class="row">
            <div class="label">NIK</div>
            <div class="value">: ${data.user?.nik || "-"}</div>
          </div>
          <div class="row">
            <div class="label">Kategori</div>
            <div class="value">: ${data.kategori?.nama_kategori || "-"}</div>
          </div>
          
          <hr style="margin: 20px 0; border-top: 1px solid #eee;" />

          <div class="row">
            <div class="label">Judul Aduan</div>
            <div class="value">: ${data.judul}</div>
          </div>
          <div class="row">
            <div class="label">Lokasi</div>
            <div class="value">: ${data.lokasi}</div>
          </div>
          
          <div style="margin-top: 15px;">
            <div class="label">Detail Masalah:</div>
            <div class="deskripsi-box">
              ${data.deskripsi}
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Dicetak pada: ${new Date().toLocaleDateString("id-ID")}</p>
          <p>Mengetahui,</p>
          <div class="ttd-area"></div>
          <p><strong>( Admin LaporPak )</strong></p>
        </div>

      </body>
      </html>
    `;

    // 4. Proses Generate PDF
    const browser = await puppeteer.launch({ headless: "new" }); // Gunakan headless new
    const page = await browser.newPage();
    
    // Set konten
    await page.setContent(content);
    
    // Buat PDF buffer
    const pdfBuffer = await page.pdf({ 
        format: "A4",
        printBackground: true, // Agar background warna tercetak
        margin: { top: "2cm", right: "2cm", bottom: "2cm", left: "2cm" }
    });

    await browser.close();

    // 5. Kirim ke Browser
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Laporan-${id}.pdf`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error("PDF GENERATION ERROR:", err);
    res.status(500).json({ message: "Gagal membuat PDF", error: err.message });
  }
};