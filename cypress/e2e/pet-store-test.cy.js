import pet from "../fixtures/pet.json";
import {faker} from "@faker-js/faker";

pet.id = faker.number.int();
pet.name = faker.animal.cat.name;
pet.category.id = faker.number.int(3);
pet.category.name = faker.animal.type();


it(`Pet creation`, () => {

    cy.request('POST', '/pet', pet).then( response => {
        expect(response.status).to.be.equal(200);
        expect(response.body.id).to.be.equal(pet.id);
        expect(response.body.name).to.be.equal(pet.name);
    })
})


// it('Create pet', () => {
//     cy.log(`Create pet with ${pet.id}`)
//
//     cy.request({
//         method: `POST`,
//         url: `/pet`,
//         body: pet
//     }).then( response => {
//         expect(response.status).to.be.equal(200);
//         expect(response.body.id).to.be.equal(pet.id);
//         expect(response.body.name).to.be.equal(pet.name);
//
//     })
// })


it(`Get pet by id ${pet.id}`, () => {

    cy.request('GET', `/pet/${pet.id}`, pet).then( response => {
        expect(response.status).to.be.equal(200);
        expect(response.body.id).to.be.equal(pet.id);
        expect(response.body.name).to.be.equal(pet.name);
        expect(response.body.category.id).to.be.equal(pet.category.id);
        expect(response.body.category.name).to.be.equal(pet.category.name);
    })
})


it(`Update pet with id ${pet.id}`, () => {

    pet.name = `Кицякумбер`;
    pet.status = `pending`;

    cy.request('PUT', '/pet', pet).then( response => {
        expect(response.status).to.be.equal(200);
        expect(response.body.id).to.be.equal(pet.id);
        expect(response.body.name).to.be.equal(pet.name);
        expect(response.body.status).to.be.equal(pet.status);
    })

    cy.request('GET', `/pet/${pet.id}`, pet).then( response => {
        expect(response.status).to.be.equal(200);
        expect(response.body.id).to.be.equal(pet.id);
        expect(response.body.category.id).to.be.equal(pet.category.id);
        expect(response.body.category.name).to.be.equal(pet.category.name);
    })
})


it(`Find pet by status ${pet.status}`, () => {

    cy.request('GET', `/pet/findByStatus?status=${pet.status}`, pet).then( response => {
        expect(response.status).to.be.equal(200);

        let pets = response.body;
        let resultPetArray = pets.filter( myPet => {
            return myPet.id === pet.id
        })

        expect(resultPetArray[0]).to.be.eql(pet);
    })
})


it(`Update pet with id ${pet.id} using form data`, () => {

    pet.name = `Murzik`;
    pet.status = `available`;

    cy.request({
        method: `POST`,
        url: `/pet/${pet.id}`,
        form: true,
        body: {
            name: pet.name,
            status: pet.status
        }
    }).then( response => {
        expect(response.status).to.be.equal(200);
        expect(response.body.message).to.be.equal(`${pet.id}`);

        let pets = response.allRequestResponses[0]['Request Body'];

        expect(pets).contains(`${pet.name}`);
        expect(pets).contains(`${pet.status}`);
    })

    cy.request('GET', `/pet/${pet.id}`, pet).then( response => {
        expect(response.status).to.be.equal(200);
        expect(response.body.id).to.be.equal(pet.id);
        expect(response.body.name).to.be.equal(pet.name);
        expect(response.body.status).to.be.equal(pet.status);
    })
})


it(`Delete pet with id ${pet.id}`, () => {

    cy.request('DELETE', `/pet/${pet.id}`).then( response => {
        expect(response.status).to.be.equal(200);
    })

    cy.request({
        method: `GET`,
        url: `/pet/${pet.id}`,
        failOnStatusCode: false
    }).then( response => {
        expect(response.status).to.be.equal(404);
    })
})