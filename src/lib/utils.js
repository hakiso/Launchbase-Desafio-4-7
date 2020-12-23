module.exports ={
    age(timestamp) {
        const today = new Date()
        const birthDate = new Date(timestamp)

        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()
    
    
        if (month < 0 || 
            month == 0 && 
            today.getDate() <= birthDate.getDate()) {
            age = age - 1
            }
    
        return age
    },
    date(timestamp) {
        const date = new Date(timestamp)

        //yyyy
        const year = date.getUTCFullYear()

        //mm
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)

        //dd
        const day = `0${date.getUTCDate()}`.slice(-2)
        
        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },
    formatHours(hours) {
        return `0${hours}`.slice(-2)
    },
    grau(education) {
        return (education == 'medio') ? 'Ensino Médio Completo'
        : (education == 'superior') ? 'Ensino Superior Completo'
        : (education == 'mestrado') ? 'Mestrado'
        : 'Doutorado'
    },
    grade(education){
        const grades = {
            '5EF': '5º Ano do Fundamental',
            '6EF': '6º Ano do Fundamental',
            '7EF': '7º Ano do Fundamental',
            '8EF': '8º Ano do Fundamental',
            '9EF': '9º Ano do Fundamental',
            '1EM': '1º Ano do Ensino Médio',
            '2EM': '2º Ano do Ensino Médio',
            '3EM': '3º Ano do Ensino Médio'
        }

        return grades[education]
    }
}




