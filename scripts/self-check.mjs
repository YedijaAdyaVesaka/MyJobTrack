import assert from "node:assert";

// Mock application dataset
const mockApplications = [
  {
    id: "1",
    company_name: "Google Indonesia",
    position: "Senior Frontend Engineer",
    location: "Kota Jakarta Selatan",
    status: "interview",
    source: "LinkedIn",
    notes: "Interview tahap teknis minggu depan",
    applied_date: "2026-09-01",
    follow_up_date: "2026-10-05",
    salary_range: "Rp 35.000.000 - 45.000.000",
  },
  {
    id: "2",
    company_name: "Tokopedia",
    position: "Backend Go Developer",
    location: "Remote",
    status: "applied",
    source: "JobStreet",
    notes: "Menunggu respons HR",
    applied_date: "2026-09-15",
    follow_up_date: null,
    salary_range: null,
  },
  {
    id: "3",
    company_name: "Shopee",
    position: "React Native Mobile Dev",
    location: "Kota Jakarta Barat",
    status: "offer",
    source: "Referral",
    notes: "Negosiasi offering letter",
    applied_date: "2026-08-20",
    follow_up_date: "2026-10-03",
    salary_range: "Rp 25.000.000",
  },
];

// Test 1: Search by company name
function searchApps(apps, query) {
  const q = query.toLowerCase().trim();
  if (!q) return apps;
  return apps.filter(
    (a) =>
      a.company_name.toLowerCase().includes(q) ||
      a.position.toLowerCase().includes(q) ||
      (a.location && a.location.toLowerCase().includes(q)) ||
      (a.source && a.source.toLowerCase().includes(q)) ||
      (a.notes && a.notes.toLowerCase().includes(q)) ||
      (a.salary_range && a.salary_range.toLowerCase().includes(q))
  );
}

// 1. Company match
const resCompany = searchApps(mockApplications, "Google");
assert.strictEqual(resCompany.length, 1);
assert.strictEqual(resCompany[0].company_name, "Google Indonesia");

// 2. Position match
const resPos = searchApps(mockApplications, "backend");
assert.strictEqual(resPos.length, 1);
assert.strictEqual(resPos[0].position, "Backend Go Developer");

// 3. Location match (Remote)
const resLoc = searchApps(mockApplications, "remote");
assert.strictEqual(resLoc.length, 1);
assert.strictEqual(resLoc[0].company_name, "Tokopedia");

// 4. Notes match
const resNotes = searchApps(mockApplications, "teknis");
assert.strictEqual(resNotes.length, 1);
assert.strictEqual(resNotes[0].id, "1");

// 5. Follow-up comparison test (ensure today and future dates are preserved)
const todayMidnight = new Date("2026-10-02T00:00:00Z");
const followUps = mockApplications.filter((a) => {
  if (!a.follow_up_date) return false;
  const d = new Date(a.follow_up_date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() >= todayMidnight.getTime();
});
assert.strictEqual(followUps.length, 2);

console.log("All search and filter validation checks passed successfully!");
