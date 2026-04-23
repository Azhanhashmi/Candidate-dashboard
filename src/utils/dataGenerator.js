const firstNames = ['Aarav','Priya','Rohan','Ananya','Vikram','Neha','Arjun','Pooja','Karan','Divya','Rahul','Sneha','Aditya','Riya','Siddharth','Meera','Ishaan','Kavya','Nikhil','Anjali','Aryan','Shruti','Ayush','Pallavi','Dev','Simran','Harsh','Tanvi','Vivek','Naina','Akash','Preeti','Yash','Swati','Varun','Deepika','Manish','Shweta','Piyush','Ankita','Gaurav','Ritika','Samir','Jyoti','Tarun','Bhavna','Kunal','Isha','Sumit','Rekha']
const lastNames = ['Sharma','Verma','Singh','Gupta','Patel','Kumar','Mehta','Shah','Rao','Joshi','Agarwal','Nair','Iyer','Mishra','Bose','Chatterjee','Pillai','Reddy','Kaur','Malhotra','Kapoor','Chopra','Saxena','Srivastava','Pandey','Dubey','Tiwari','Yadav','Thakur','Das']
const colleges = ['IIT Bombay','IIT Delhi','IIT Madras','IIT Kanpur','IIT Kharagpur','BITS Pilani','NIT Trichy','NIT Warangal','VIT Vellore','DTU Delhi','NSIT Delhi','Jadavpur University','IIIT Hyderabad','IIIT Bangalore','Manipal University','Amity University','Symbiosis Pune','SRM Chennai','Anna University','Pune University','Mumbai University','Delhi University','Bangalore University','Hyderabad University','Chandigarh University']

function rand(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateCandidates() {
  return Array.from({ length: 100 }, (_, i) => {
    const assignment_score = rand(20, 100)
    const video_score = rand(20, 100)
    const ats_score = rand(30, 100)
    const github_score = rand(20, 100)
    const communication_score = rand(25, 100)

    const reviewChance = Math.random()
    const reviewed = reviewChance > 0.35
    const shortlisted = reviewed && Math.random() > 0.5

    return {
      id: `c-${i + 1}`,
      name: `${randomFrom(firstNames)} ${randomFrom(lastNames)}`,
      college: randomFrom(colleges),
      assignment_score,
      video_score,
      ats_score,
      github_score,
      communication_score,
      reviewed,
      shortlisted,
      status: shortlisted ? 'Shortlisted' : reviewed ? 'Reviewed' : 'Pending',
      appliedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
  })
}
