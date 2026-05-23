import Image from "next/image";

type TeamMember = {
  nim: string;
  name: string;
  major: string;
  role: "Main Developer" | "Support Developer";
  teamRole: string;
};

const teamMembers: TeamMember[] = [
  {
    nim: "11S25026",
    name: "Jose Mourinho Napitupulu",
    major: "Informatika",
    role: "Main Developer",
    teamRole: "Technical Lead"
  },
  {
    nim: "12S25046",
    name: "Airin Tania Purba",
    major: "Sistem Informasi",
    role: "Support Developer",
    teamRole: "UI and Visual Design"
  },
  {
    nim: "11S25056",
    name: "Reyhan Samuel Tindaon",
    major: "Informatika",
    role: "Support Developer",
    teamRole: "Operational and DevOps"
  },
  {
    nim: "11S25046",
    name: "Raja Kausar Pane",
    major: "Informatika",
    role: "Support Developer",
    teamRole: "Backend Engineering"
  },
  {
    nim: "22S25018",
    name: "Fidya Stefani Manalu",
    major: "Teknik Metalurgi",
    role: "Support Developer",
    teamRole: "Quality Assurance"
  },
  {
    nim: "21S25044",
    name: "Anggi Robasa Limbong",
    major: "Manajemen Rekayasa",
    role: "Support Developer",
    teamRole: "Project Operations"
  },
  {
    nim: "22S25031",
    name: "Ester Irene Pakpahan",
    major: "Teknik Metalurgi",
    role: "Support Developer",
    teamRole: "Data and Reporting"
  },
  {
    nim: "11S25047",
    name: "Billy Jericho Sirait",
    major: "Informatika",
    role: "Support Developer",
    teamRole: "Frontend Engineering"
  }
];

export default function DeveloperPage() {
  const lead = teamMembers.find((member) => member.role === "Main Developer");
  const maleSupportNames = ["Raja Kausar Pane", "Billy Jericho Sirait", "Reyhan Samuel Tindaon"];
  const maleSupports = teamMembers.filter(
    (member) => member.role === "Support Developer" && maleSupportNames.includes(member.name)
  );
  const femaleSupports = teamMembers.filter(
    (member) => member.role === "Support Developer" && !maleSupportNames.includes(member.name)
  );

  return (
    <section className="page-shell space-y-8 py-12">
      <div className="space-y-4">
        <span className="inline-flex rounded-full bg-campus-100 px-4 py-2 text-sm font-semibold text-campus-700">
          Kelompok 4
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Developer Project PRD</h1>
        <p className="max-w-3xl text-slate-600">
          Halaman ini menampilkan tim pengembang sistem pelaporan kerusakan kampus.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-200 bg-gradient-to-r from-campus-50 to-slate-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Identitas Kelompok 4</h2>
          <p className="text-sm text-slate-600">Institut Teknologi Del - Project Requirement Definition</p>
        </div>
        <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="relative h-52 w-full sm:h-64 rounded-2xl overflow-hidden border border-slate-200">
            <Image
              src="/kelompok4.jpeg"
              alt="Foto tim Kelompok 4"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-3">
            <p className="inline-flex rounded-full bg-campus-100 px-3 py-1 text-xs font-semibold text-campus-700">
              Kelompok 4
            </p>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Tim Pengembang Sistem LaporKerusakan</h3>
            <p className="text-sm leading-6 text-slate-600">
              Satu tim lintas prodi yang berkolaborasi membangun platform pelaporan kerusakan fasilitas kampus IT Del.
            </p>
            </div>
        </div>
      </div>

      {lead ? (
        <div className="card border-campus-200 bg-campus-50/40 p-6">
          <p className="text-sm font-semibold text-campus-700">Main Developer</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{lead.name}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {lead.nim} - {lead.major}
          </p>
          <p className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-campus-700">
            {lead.teamRole}
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="font-semibold text-slate-950">Squad Implementasi</h3>
            <p className="text-xs text-slate-500">Fokus pada pengembangan teknis inti aplikasi.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">NIM</th>
                  <th className="px-6 py-3 font-semibold">Nama</th>
                  <th className="px-6 py-3 font-semibold">Role Tim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {maleSupports.map((member) => (
                  <tr key={member.nim}>
                    <td className="px-6 py-4 text-slate-700">{member.nim}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{member.name}</td>
                    <td className="px-6 py-4 text-slate-700">{member.teamRole}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="font-semibold text-slate-950">Squad Penguatan Produk</h3>
            <p className="text-xs text-slate-500">Fokus pada kualitas, operasional, dan keberlanjutan produk.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">NIM</th>
                  <th className="px-6 py-3 font-semibold">Nama</th>
                  <th className="px-6 py-3 font-semibold">Role Tim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {femaleSupports.map((member) => (
                  <tr key={member.nim}>
                    <td className="px-6 py-4 text-slate-700">{member.nim}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{member.name}</td>
                    <td className="px-6 py-4 text-slate-700">{member.teamRole}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
