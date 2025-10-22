import type { Question, FinalLevel, AnswerChoice } from '@/types/survey';

export const surveyQuestions: Question[] = [
  {
    id: 'Q1',
    text: 'Seberapa lengkap sarana TIK di sekolah Anda?',
    options: {
      A: {
        text: 'Belum tersedia sama sekali',
        feedback:
          'Lakukan pendataan kebutuhan prioritas, ajukan proposal bantuan ke dinas pendidikan, dan alokasikan sebagian dana BOS untuk pengadaan bertahap.',
      },
      B: {
        text: 'Ada tapi terbatas (misal: hanya di lab komputer)',
        feedback:
          'Atur jadwal penggunaan sarana secara efisien, optimalkan jaringan internet yang ada, dan berikan pelatihan dasar TIK kepada guru.',
      },
      C: {
        text: 'Lengkap di beberapa titik tapi belum dimanfaatkan maksimal',
        feedback:
          'Selenggarakan workshop pemanfaatan TIK dalam pembelajaran, lakukan monitoring dan evaluasi rutin, serta buat komunitas belajar guru.',
      },
      D: {
        text: 'Lengkap, terhubung internet, dan dimanfaatkan secara optimal',
        feedback:
          'Dokumentasikan praktik-praktik baik pemanfaatan TIK, dan bagikan inovasi tersebut ke sekolah-sekolah lain melalui forum atau media digital.',
      },
    },
  },
  {
    id: 'Q2',
    text: 'Bagaimana kemampuan guru dalam memanfaatkan platform digital seperti Rumah Belajar, Merdeka Mengajar (PMM), atau platform lainnya?',
    options: {
      A: {
        text: 'Sebagian besar belum pernah mencoba',
        feedback:
          'Lakukan sosialisasi dasar mengenai manfaat platform, sediakan tutorial video sederhana, dan bentuk kelompok belajar guru untuk saling mendukung.',
      },
      B: {
        text: 'Ada beberapa guru yang sudah mencoba secara mandiri',
        feedback:
          'Fasilitasi sesi berbagi (peer teaching) dari guru yang sudah mahir, dan tetapkan target penggunaan minimal platform dalam Rencana Pelaksanaan Pembelajaran (RPP).',
      },
      C: {
        text: 'Mayoritas sudah menggunakan, tapi belum terintegrasi dalam pembelajaran',
        feedback:
          'Integrasikan pemanfaatan platform digital secara eksplisit dalam kurikulum sekolah, dan lakukan supervisi akademik untuk memastikan implementasinya.',
      },
      D: {
        text: 'Sudah menjadi rutinitas dan guru berinovasi secara kreatif',
        feedback:
          'Dokumentasikan inovasi pembelajaran yang dibuat, bagikan karya guru di platform PMM, dan aktif berbagi praktik baik di forum MGMP/KKG.',
      },
    },
  },
  {
    id: 'Q3',
    text: 'Bagaimana dukungan kepala sekolah dan manajemen terhadap program digitalisasi?',
    options: {
      A: {
        text: 'Tidak ada kebijakan atau dukungan khusus',
        feedback:
          'Lakukan advokasi kepada kepala sekolah mengenai urgensi dan manfaat digitalisasi dengan menyajikan data dan contoh keberhasilan dari sekolah lain.',
      },
      B: {
        text: 'Mendukung secara lisan, tapi belum ada aksi nyata',
        feedback:
          'Usulkan program digitalisasi untuk diintegrasikan dalam Rencana Kerja dan Anggaran Sekolah (RKAS) dan jadikan sebagai agenda rutin dalam rapat dewan guru.',
      },
      C: {
        text: 'Mendukung aktif dengan menyediakan beberapa sumber daya',
        feedback:
          'Tingkatkan frekuensi monitoring dan evaluasi program, perluas kolaborasi dengan pihak eksternal (dunia usaha, komunitas) untuk penguatan program.',
      },
      D: {
        text: 'Sangat mendukung, menjadi prioritas, dan dialokasikan sumber daya memadai',
        feedback:
          'Pertahankan komitmen dan kembangkan jejaring dengan sekolah-sekolah lain untuk menciptakan ekosistem digital yang lebih luas.',
      },
    },
  },
  {
    id: 'Q4',
    text: 'Sejauh mana siswa terlibat aktif dalam pembelajaran yang memanfaatkan teknologi digital?',
    options: {
      A: {
        text: 'Belum sama sekali, pembelajaran masih konvensional',
        feedback:
          'Mulai dengan langkah kecil seperti menggunakan video pembelajaran dari YouTube atau memberikan tugas membaca melalui e-book/PDF.',
      },
      B: {
        text: 'Sesekali saja, jika ada tugas tertentu dari guru',
        feedback:
          'Buat kebijakan yang mendorong setiap mata pelajaran untuk memberikan minimal satu pengalaman belajar digital kepada siswa setiap minggunya.',
      },
      C: {
        text: 'Cukup sering, tapi belum menjadi budaya belajar mandiri siswa',
        feedback:
          'Integrasikan teknologi digital dalam penilaian formatif, tugas proyek, atau kegiatan kokurikuler untuk membiasakan siswa.',
      },
      D: {
        text: 'Sudah menjadi budaya belajar, siswa aktif mencari sumber belajar digital',
        feedback:
          'Dokumentasikan proyek-proyek siswa yang inovatif, fasilitasi mereka untuk mengikuti kompetisi berbasis TIK, dan jadikan sekolah sebagai model pembelajaran digital.',
      },
    },
  },
  {
    id: 'Q5',
    text: 'Apakah sekolah memiliki mekanisme evaluasi dan perbaikan berkelanjutan untuk pemanfaatan TIK?',
    options: {
      A: {
        text: 'Belum ada mekanisme evaluasi sama sekali',
        feedback:
          'Mulai dengan membuat survei sederhana kepada guru dan siswa untuk mengumpulkan umpan balik awal mengenai pemanfaatan TIK.',
      },
      B: {
        text: 'Ada evaluasi, tapi sifatnya insidental dan tidak rutin',
        feedback:
          'Jadwalkan evaluasi pemanfaatan TIK secara rutin, misalnya setiap akhir semester, dan libatkan perwakilan dari guru dan siswa.',
      },
      C: {
        text: 'Rutin dievaluasi, tapi hasilnya belum ditindaklanjuti secara optimal',
        feedback:
          'Gunakan hasil evaluasi sebagai dasar utama dalam penyusunan rencana program TIK untuk tahun ajaran berikutnya.',
      },
      D: {
        text: 'Rutin dievaluasi, ditindaklanjuti, dan menjadi dasar perencanaan',
        feedback:
          'Pertahankan siklus evaluasi dan perbaikan ini. Bagikan metodologi dan hasil evaluasi yang berhasil ke forum kepala sekolah sebagai inspirasi.',
      },
    },
  },
];

export const finalLevels: Record<AnswerChoice, FinalLevel> = {
  A: {
    key: 'A',
    level: 'Tingkat Dasar',
    characteristic:
      'Sekolah berada pada tahap awal pengenalan digitalisasi. Infrastruktur, kompetensi, dan kebijakan masih sangat terbatas. Fokus utama adalah membangun fondasi dan kesadaran.',
    recommendations: [
      'Bentuk Tim TIK Sekolah untuk menyusun peta jalan digitalisasi.',
      'Fokus pada pengadaan infrastruktur dasar (internet, proyektor) secara bertahap.',
      'Adakan pelatihan TIK level pemula bagi seluruh guru.',
    ],
  },
  B: {
    key: 'B',
    level: 'Tingkat Menengah',
    characteristic:
      'Sekolah sudah memiliki beberapa inisiatif digital, namun belum terstruktur dan merata. Beberapa guru sudah mulai mencoba, tapi pemanfaatan belum menjadi budaya.',
    recommendations: [
      'Standarisasi penggunaan platform pembelajaran digital (misal: Google Workspace, PMM).',
      'Buat jadwal rutin untuk sesi berbagi praktik baik antar guru (peer teaching).',
      'Integrasikan alokasi anggaran TIK secara eksplisit dalam RKAS.',
    ],
  },
  C: {
    key: 'C',
    level: 'Tingkat Lanjut',
    characteristic:
      'Pemanfaatan TIK sudah cukup merata dan menjadi bagian dari proses pembelajaran. Dukungan manajemen sudah baik, namun perlu optimalisasi dan integrasi yang lebih dalam.',
    recommendations: [
      'Kembangkan konten-konten digital orisinal buatan guru dan siswa.',
      'Lakukan supervisi akademik yang berfokus pada integrasi TIK dalam pedagogi.',
      'Mulai bangun kolaborasi digital dengan sekolah atau institusi lain.',
    ],
  },
  D: {
    key: 'D',
    level: 'Tingkat Optimal',
    characteristic:
      'Digitalisasi telah menjadi budaya sekolah. Pemanfaatan TIK sudah optimal, kreatif, dan terintegrasi penuh dalam kurikulum dan manajemen sekolah. Sekolah menjadi rujukan.',
    recommendations: [
      'Dokumentasikan dan publikasikan praktik-praktik baik secara luas.',
      'Jadikan sekolah sebagai pusat pelatihan atau mentor bagi sekolah-sekolah di sekitarnya.',
      'Terus berinovasi dengan menjajaki teknologi-teknologi pembelajaran baru (AI, VR, dll).',
    ],
  },
};
