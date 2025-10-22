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
      'Infrastruktur terbatas/ belum ada, guru belum mencoba platform, siswa minim keterlibatan, manajemen sekolah pasif, evaluasi belum ada.',
    recommendations: [
      'Infrastruktur: Lakukan pendataan kebutuhan TIK, manfaatkan BOS untuk pembelian sarana dasar, ajukan bantuan ke Dinas.',
      'SDM Guru: Adakan sosialisasi dan pelatihan dasar penggunaan Rumah Belajar, Rumah Pendidikan, dan IFP.',
      'Manajemen: Advokasi kepala sekolah agar memasukkan program digitalisasi dalam RKAS dan rapat sekolah.',
      'Siswa: Mulai dengan penggunaan sederhana (video pembelajaran, e-book).',
      'Evaluasi: Susun instrumen evaluasi sederhana (misalnya survei kepuasan guru/siswa).',
    ],
  },
  B: {
    key: 'B',
    level: 'Tingkat Menengah',
    characteristic:
      'Sarana ada tapi terbatas, sebagian guru mulai mencoba, siswa kadang terlibat, kepala sekolah mendukung pasif, evaluasi belum rutin.',
    recommendations: [
      'Infrastruktur: Optimalkan sarana yang ada, atur jadwal pemakaian, tingkatkan koneksi internet.',
      'SDM Guru: Kembangkan peer teaching, buat kelompok belajar guru, tetapkan target minimal pemanfaatan platform digital.',
      'Manajemen: Kepala sekolah diarahkan untuk memasukkan target digitalisasi ke dalam program kerja tahunan.',
      'Siswa: Buat kebijakan agar pembelajaran digital menjadi bagian dari rutinitas misalnya tugas berbasis platform setiap minggu).',
      'Evaluasi: Jadwalkan evaluasi minimal per semester.',
    ],
  },
  C: {
    key: 'C',
    level: 'Tingkat Lanjut',
    characteristic:
      'Sarana lengkap tapi belum maksimal, mayoritas guru sudah memanfaatkan tapi belum terintegrasi, siswa sering terlibat namun belum jadi budaya, evaluasi rutin tapi belum ditindaklanjuti.',
    recommendations: [
      'Infrastruktur: Monitoring pemanfaatan sarana agar optimal, lakukan pemeliharaan berkala.',
      'SDM Guru: Integrasikan pemanfaatan Rumah Belajar, Rumah Pendidikan, IFP ke kurikulum, RPP, dan supervisi pembelajaran.',
      'Manajemen: Kepala sekolah meningkatkan monitoring dan memperluas kolaborasi (misalnya dengan sekolah lain).',
      'Siswa: Tugas, proyek, ujian formatif berbasis digital untuk membentuk budaya belajar.',
      'Evaluasi: Gunakan hasil evaluasi untuk perbaikan pembelajaran, masukkan ke dalam laporan sekolah.',
    ],
  },
  D: {
    key: 'D',
    level: 'Tingkat Optimal',
    characteristic:
      'Infrastruktur lengkap dan terpakai optimal, guru rutin & kreatif, kepala sekolah sangat mendukung, siswa sudah menjadikan digitalisasi sebagai budaya, evaluasi rutin & ditindaklanjuti.',
    recommendations: [
      'Infrastruktur: Dokumentasikan praktik baik penggunaan TIK, sebarkan sebagai inspirasi.',
      'SDM Guru: Dorong guru untuk menghasilkan inovasi pembelajaran digital dan mempresentasikannya di forum MGMP/KKG.',
      'Manajemen: Jadikan sekolah sebagai role model digitalisasi, aktif dalam jejaring antar sekolah.',
      'Siswa: Kembangkan student digital project (produk kreatif berbasis digital) dan ikutkan lomba.',
      'Evaluasi: Publikasikan hasil evaluasi & tindak lanjut, bagikan praktik baik di forum kepala sekolah/Dinas.',
    ],
  },
};
