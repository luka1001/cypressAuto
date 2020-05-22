import {getRandomPaymentCard} from "../helpers/generate-random-data"
import {User} from "../support/seeds/users"
import joinNow from "../helpers/join-now"
import mealPlans from "../fixtures/meal-plans"
import addresses from "../support/data/valid-addresses"
import deliveries from "../helpers/deliveries"
import subscription from "../helpers/subscription";

const {_} = Cypress;

describe("Check different functional at Delivery page", () => {
    let user;
    let paymentCard;
    let address;
    let mealPlan;


    beforeEach(() => {
        cy.clearSession()
        joinNow.getStarted.visitGetStartedPage()
        user = new User();
        paymentCard = getRandomPaymentCard();
        address = _.sample(addresses)
        mealPlan = _.sample(mealPlans)
    })

    it("1-User is able to change meals from Delivery page", () => {

        joinNow.getStarted.fillOutGetStartedForm(user, address);
        joinNow.planPicker.chooseMealPlan(mealPlan);
        joinNow.dayPicker.chooseFirstDeliveryDayFromAvailable();
        joinNow.mealsPicker.chooseMealsFromMealPlanner(mealPlan.meals);// empty parameter leads to selecting different meals
        joinNow.checkOut.fillRegistrationData.fillUserData(user, address)
        joinNow.checkOut.paymentPanel.fillOutPaymentInfoWithCard(paymentCard);
        joinNow.checkOut.paymentPanel.submitPaymentForm();
        joinNow.subscription.skipBothAttributionForms();
        joinNow.subscription.getFirstNameHeader().should("be.visible").should("contain", user.firstName);
        deliveries.second_week.firstMealName().invoke('text').then((firstMealBeforeChanging) => {
            deliveries.second_week.changeMeals().should("be.visible").click();
            deliveries.deliveries.selectingNewMeals(mealPlan.meals);
            deliveries.second_week.firstMealName().invoke('text').should((firstMealAfterChanging) => {
                expect(firstMealBeforeChanging).not.to.eq(firstMealAfterChanging)
            })
        })

    })

    it("2-User is able to change meal plan from Delivery page", () => {

        joinNow.getStarted.fillOutGetStartedForm(user, address);
        joinNow.planPicker.chooseMealPlan(mealPlan);
        joinNow.dayPicker.chooseFirstDeliveryDayFromAvailable();
        joinNow.mealsPicker.chooseMealsFromMealPlanner(mealPlan.meals);// empty parameter leads to selecting different meals
        joinNow.checkOut.fillRegistrationData.fillUserData(user, address)
        joinNow.checkOut.paymentPanel.fillOutPaymentInfoWithCard(paymentCard);
        joinNow.checkOut.paymentPanel.submitPaymentForm();
        joinNow.subscription.skipBothAttributionForms();
        joinNow.subscription.getFirstNameHeader().should("be.visible").should("contain", user.firstName);
        deliveries.second_week.plan().invoke('text').then((planBeforeChanging) => {
            deliveries.second_week.changePlan();
            joinNow.toastMessage.checkMessage("Meal plan successfully updated")
            deliveries.second_week.plan().invoke('text').should((planAfterChanging) => {
                expect(planBeforeChanging.trim()).not.to.eq(planAfterChanging.trim())
            })
        })

    })

    it("3-User is able to change delivery date from Delivery page", () => {

        joinNow.getStarted.fillOutGetStartedForm(user, address);
        joinNow.planPicker.chooseMealPlan(mealPlan);
        joinNow.dayPicker.chooseFirstDeliveryDayFromAvailable();
        joinNow.mealsPicker.chooseMealsFromMealPlanner(mealPlan.meals);// empty parameter leads to selecting different meals
        joinNow.checkOut.fillRegistrationData.fillUserData(user, address)
        joinNow.checkOut.paymentPanel.fillOutPaymentInfoWithCard(paymentCard);
        joinNow.checkOut.paymentPanel.submitPaymentForm();
        joinNow.subscription.skipBothAttributionForms();
        joinNow.subscription.getFirstNameHeader().should("be.visible").should("contain", user.firstName);
        deliveries.second_week.deliveryDay().invoke('text').then((dayBeforeChanging) => {
            deliveries.second_week.changeDeliveryDay();
            joinNow.toastMessage.checkMessage("Delivery date successfully updated")
            deliveries.second_week.deliveryDay().invoke('text').should((dayAfterChanging) => {
                expect(dayBeforeChanging.trim()).not.to.eq(dayAfterChanging.trim())
            })
        })

    })

    it("5-User is able to skip/uskip a week from Delivery page", () => {

        joinNow.getStarted.fillOutGetStartedForm(user, address);
        joinNow.planPicker.chooseMealPlan(mealPlan);
        joinNow.dayPicker.chooseFirstDeliveryDayFromAvailable();
        joinNow.mealsPicker.chooseMealsFromMealPlanner(mealPlan.meals);// empty parameter leads to selecting different meals
        joinNow.checkOut.fillRegistrationData.fillUserData(user, address)
        joinNow.checkOut.paymentPanel.fillOutPaymentInfoWithCard(paymentCard);
        joinNow.checkOut.paymentPanel.submitPaymentForm();
        joinNow.subscription.skipBothAttributionForms();
        joinNow.subscription.getFirstNameHeader().should("be.visible").should("contain", user.firstName);
        deliveries.second_week.skipWeek().should("be.visible").click();
        joinNow.navBar.clickOnDeliveries();
        cy.wait(5000);
        deliveries.second_week.unSkipWeek().wait(5000).click().then(() => {
            joinNow.navBar.clickOnDeliveries();
            cy.wait(5000);
            deliveries.second_week.skipWeek().wait(5000).should("be.visible");
        })

    })


});
