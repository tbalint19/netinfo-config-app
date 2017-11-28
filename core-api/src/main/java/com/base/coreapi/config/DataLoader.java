package com.base.coreapi.config;

import com.base.coreapi.model.auth.ApplicationUser;
import com.base.coreapi.model.auth.Confirmation;
import com.base.coreapi.model.oscc.OsccNamespace;
import com.base.coreapi.model.oscc.OsccType;
import com.base.coreapi.model.oscc.Version;
import com.base.coreapi.model.oscc.VersionOfType;
import com.base.coreapi.service.auth.ConfirmationService;
import com.base.coreapi.service.auth.UserService;
import com.base.coreapi.service.oscc.NamespaceService;
import com.base.coreapi.service.oscc.TypeService;
import com.base.coreapi.service.oscc.VersionOfTypeService;
import com.base.coreapi.service.oscc.VersionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class DataLoader {


    @Autowired
    private UserService userService;

    @Autowired
    private ConfirmationService confirmationService;

    @Autowired
    private NamespaceService namespaceService;

    @Autowired
    private VersionService versionService;

    @Autowired
    private TypeService typeService;

    @Autowired
    private VersionOfTypeService versionOfTypeService;

    @PostConstruct
    public void createUser() {
        ApplicationUser user = new ApplicationUser();
        user.setEmail("");
        user.setUsername("tothbalint");
        user.setPassword("0123456789");
        Confirmation confirmation = confirmationService.createConfirmation();
        userService.createUser(user, confirmation);
        confirmationService.attemptConfirm(user.getUsername(), confirmation.getCode());
    }


    @PostConstruct
    public void createRoamingData() {
        OsccNamespace roaming = new OsccNamespace();
        roaming.setName("Roaming");
        namespaceService.save(roaming);

        Version version = new Version();
        version.setOrderInBundle(1);
        version.setName("2018 marc");
        version.setNumber("1.0.0");
        versionService.save(version);

        // -------- common -------------


        OsccType type = new OsccType();
        type.setName("multilanguage");
        type.setComplex(false);
        typeService.save(type);

        VersionOfType multilanguage = new VersionOfType();
        multilanguage.setType(type);
        multilanguage.setVersion(version);
        multilanguage.setStructure("{\"multilanguage\":{\"eng\":\"string\", \"hun\":\"string\", \"def\":\"string\", \"unLocalized\":\"string\"}}");
        versionOfTypeService.save(multilanguage);

        OsccType psmcodesType = new OsccType();
        psmcodesType.setName("PSMCodes");
        psmcodesType.setComplex(false);
        typeService.save(psmcodesType);

        VersionOfType psmcodes = new VersionOfType();
        psmcodes.setType(psmcodesType);
        psmcodes.setVersion(version);
        psmcodes.setStructure("{\"PSMCodes\": {\"Activation\":\"string\",\"Deactivation\":\"string\", " +
                "\"Status\":\"string\", \"Status\":\"string\", \"Repeat\":\"string\"}}");
        versionOfTypeService.save(psmcodes);


        OsccType tyhtaMarkersType = new OsccType();
        tyhtaMarkersType.setName("TyhtaMarkers");
        tyhtaMarkersType.setComplex(false);
        typeService.save(tyhtaMarkersType);

        VersionOfType tyhtaMarkers = new VersionOfType();
        tyhtaMarkers.setType(tyhtaMarkersType);
        tyhtaMarkers.setVersion(version);
        tyhtaMarkers.setStructure("{\"TythtaMarkers\": {\"Entitlement\":\"string\"}}");
        versionOfTypeService.save(tyhtaMarkers);

        // -------- roaming -------------

        OsccType roamingOfferType = new OsccType();
        roamingOfferType.setName("Offer");
        roamingOfferType.setComplex(true);
        roamingOfferType.setNamespace(roaming);
        typeService.save(roamingOfferType);

        VersionOfType roamingOffer = new VersionOfType();
        roamingOffer.setType(roamingOfferType);
        roamingOffer.setVersion(version);
        roamingOffer.setStructure("{\"Offer\":{\"Id\":\"string\", \"Name\":\"multilanguage\", \"Description\":\"multilanguage\"," +
                "\"Type\":\"string ---> \", \"VFPLAN\":\"string ---> \", \"Warning_percent\":\"number ---> \", \"Throttling_limit_mb\":\"number ---> \"," +
                "\"Active\":\"boolean ---> \", \"Price\":\"number ---> \", \"Discount_counter_direction\":\"string ---> \", " +
                "\"Warning_text\":\"multilanguage\", \"Throttling_text\":\"multilanguage\",\"Throttling_Accepted_Text\":\"multilanguage\", \"Repeatable\":\"boolean ---> \"," +
                "\"Upgrade_offer_ids\":\"Offer-list\", \"PSMCodes\":\"PSMCodes\"}}");
        versionOfTypeService.save(roamingOffer);

        OsccType roamingOfferConfigType = new OsccType();
        roamingOfferConfigType.setName("OfferConfig");
        roamingOfferConfigType.setComplex(true);
        roamingOfferConfigType.setNamespace(roaming);
        typeService.save(roamingOfferConfigType);

        VersionOfType roamingOfferConfig = new VersionOfType();
        roamingOfferConfig.setVersion(version);
        roamingOfferConfig.setType(roamingOfferConfigType);
        roamingOfferConfig.setStructure("{\"OfferConfig\":{\"Id\":\"string\", \"Offers\":\"Offer-list\"}}");
        versionOfTypeService.save(roamingOfferConfig);


        // -------- post -------------

        OsccNamespace post = new OsccNamespace();
        post.setName("Post");
        namespaceService.save(post);

        OsccType UnlimitedContentPackageType = new OsccType();
        UnlimitedContentPackageType.setName("UnlimitedContentPackage");
        UnlimitedContentPackageType.setComplex(true);
        UnlimitedContentPackageType.setNamespace(post);
        typeService.save(UnlimitedContentPackageType);

        VersionOfType UnlimitedContentPackage = new VersionOfType();
        UnlimitedContentPackage.setType(UnlimitedContentPackageType);
        UnlimitedContentPackage.setVersion(version);
        UnlimitedContentPackage.setStructure("{\"UnlimitedContentPackage\":{\"Id\":\"string\", \"Name\":\"multilanguage\"," +
                "\"Description\":\"multilanguage\", \"Active\":\"boolean ---> \", \"Featured\":\"boolean ---> \"," +
                "\"Price\":\"number ---> \", \"PSMCodes\":\"PSMCodes\"}}");
        versionOfTypeService.save(UnlimitedContentPackage);

        OsccType postRefillType = new OsccType();
        postRefillType.setName("Refill");
        postRefillType.setComplex(true);
        postRefillType.setNamespace(post);
        typeService.save(postRefillType);

        VersionOfType postRefill = new VersionOfType();
        postRefill.setType(postRefillType);
        postRefill.setVersion(version);
        postRefill.setStructure("{\"Refill\":{\"Id\":\"string\", \"Name\":\"multilanguage\", \"Description\":\"multilanguage\"," +
                "\"Type\":\"string ---> \", \"Active\":\"boolean ---> \", \"Price\":\"number ---> \", \"PSMCodes\":\"PSMCodes\"}}");
        versionOfTypeService.save(postRefill);

        OsccType multipleOrderAddonType = new OsccType();
        multipleOrderAddonType.setName("MultipleOrderAddonType");
        multipleOrderAddonType.setComplex(true);
        multipleOrderAddonType.setNamespace(post);
        typeService.save(multipleOrderAddonType);

        VersionOfType multipleOrderAddon = new VersionOfType();
        multipleOrderAddon.setType(multipleOrderAddonType);
        multipleOrderAddon.setVersion(version);
        multipleOrderAddon.setStructure("{\"MultipleOrderAddonType\":{\"Id\":\"string\"}}");
        versionOfTypeService.save(multipleOrderAddon);

        OsccType poolsType = new OsccType();
        poolsType.setName("Pools");
        poolsType.setComplex(true);
        poolsType.setNamespace(post);
        typeService.save(poolsType);

        VersionOfType pools = new VersionOfType();
        pools.setType(poolsType);
        pools.setVersion(version);
        pools.setStructure("{\"Pools\":{\"PSMCodes\":\"PSMCodes\",\"Pools\":\"Pool-list\"}}");
        versionOfTypeService.save(pools);

        OsccType postPoolType = new OsccType();
        postPoolType.setName("Pool");
        postPoolType.setComplex(true);
        postPoolType.setNamespace(post);
        typeService.save(postPoolType);

        VersionOfType postPool = new VersionOfType();
        postPool.setType(postPoolType);
        postPool.setVersion(version);
        postPool.setStructure("{\"Pool\":{\"Id\":\"string\", \"Name\":\"multilanguage\", \"Type\":\"string ---> \"," +
                "\"Data_usage_mb\":\"number ---> \", \"Description\":\"multilanguage\", \"MaxMember\":\"number ---> \"," +
                "\"Active\":\"boolean ---> \", \"Featured\":\"boolean ---> \", \"BaseOfferIncluded\":\"boolean ---> \"," +
                "\"Price\":\"number ---> \", \"Online_selfcare_id\":\"string ---> \", \"Upgrade_pool_ids\":\"Pool-list\"," +
                "\"Offer_ids_master\":\"Offer-list\", \"Offer_ids_member\":\"Offer-list\", \"Addon_ids_master\":\"Addon-list\"," +
                "\"Addon_ids_member\":\"Addon-list\", \"Refill_ids\":\"Refill-list\", \"UnlimitedContentPackages\":\"UnlimitedContent-list\"," +
                "\"PSMCodes\":\"PSMCodes\"}}");
        versionOfTypeService.save(postPool);

        OsccType postAddonType = new OsccType();
        postAddonType.setName("Addon");
        postAddonType.setComplex(true);
        postAddonType.setNamespace(post);
        typeService.save(postAddonType);

        VersionOfType postAddon = new VersionOfType();
        postAddon.setType(postAddonType);
        postAddon.setVersion(version);
        postAddon.setStructure("{\"Addon\":{\"Id\":\"string\", \"Name\":\"multilanguage\", \"Type\":\"string ---> \"," +
                "\"Unlimited\":\"boolean ---> \", \"Data_usage_mb\":\"number ---> \", \"Description\":\"multilanguage\"," +
                "\"Active\":\"boolean ---> \", \"Featured\":\"boolean ---> \", \"Price\":\"number ---> \"," +
                "\"Online_selfcare_id\":\"string ---> \", \"Refill_ids\":\"Refill-list\", \"PSMCodes\":\"PSMCodes\"}}");
        versionOfTypeService.save(postAddon);

        OsccType postOfferType = new OsccType();
        postOfferType.setName("Offer");
        postOfferType.setComplex(true);
        postOfferType.setNamespace(post);
        typeService.save(postOfferType);

        VersionOfType postOffer = new VersionOfType();
        postOffer.setType(postOfferType);
        postOffer.setVersion(version);
        postOffer.setStructure("{\"Offer\":{\"Id\":\"string\",\"Name\":\"multilanguage\",\"Description\":\"multilanguage\"," +
                "\"Price\":\"number ---> \", \"Type\":\"string ---> \", \"Throttling_limit_mb\":\"number ---> \"," +
                "\"Warning_percent\":\"number ---> \", \"Warning_text\":\"multilanguage\", \"Throttling_text\":\"multilanguage\"," +
                "\"Throttling_accepted_text\":\"multilanguage\", \"Continue_with_throttling\":\"boolean ---> \", " +
                "\"Active\":\"boolean ---> \", \"Featured\":\"boolean ---> \", \"Online_selfcare_id\":\"string ---> \"," +
                "\"Upgrade_offer_ids\":\"Offer-list\", \"Addon_ids\":\"Addon-list\", \"Pool_ids\":\"Pool-list\"," +
                "\"UnlimitedContentPackages\":\"UnlimitedContentPackage-list\", \"PSMCodes\":\"PSMCodes\"}}");
        versionOfTypeService.save(postOffer);

        OsccType postOfferConfig = new OsccType();
        postOfferConfig.setName("OfferConfig");
        postOfferConfig.setComplex(true);
        postOfferConfig.setNamespace(post);
        typeService.save(postOfferConfig);

        VersionOfType offerConfig = new VersionOfType();
        offerConfig.setVersion(version);
        offerConfig.setType(postOfferConfig);
        offerConfig.setStructure("{\"OfferConfig\":{\"Id\":\"string\", \"TyhtaMarkers\":\"TyhtaMarkers\", \"Offers\":\"Offer-list\"," +
                "\"Addons\":\"Addon-list\", \"MultipleOrderAddonTypes\":\"MultipleOrderAddonType-list\", " +
                "\"Pools\":\"Pools-list\", \"Refills\":\"Refill-list\"," +
                "\"UnlimitedContentPackages\":\"UnlimitedContentPackage-list\"}}");
        versionOfTypeService.save(offerConfig);
    }

}