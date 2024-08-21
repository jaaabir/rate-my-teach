import SearchSchool from "@/components/register-school/searchSchool"

const RegisterSchool = () => {

    const handleGetUnivInfo = async (url) => {
        const response = await fetch('/api/get-univ-info', {
            method : 'POST',
            body : JSON.parse({ url }),
        })
        console.log(response)
    }
    return (
        <>
        <div>Register School</div>
        <SearchSchool />
        </>
    )
}

export default RegisterSchool
