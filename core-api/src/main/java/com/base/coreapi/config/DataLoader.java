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

        OsccType type = new OsccType();
        type.setName("multilanguage");
        type.setComplex(false);
        typeService.save(type);

        VersionOfType multilanguage = new VersionOfType();
        multilanguage.setType(type);
        multilanguage.setVersion(version);
        multilanguage.setStructure("{\"multilanguage\":{\"eng\":\"string\", \"hun\":\"string\", \"unLocalized\":\"string\"}}");
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

        OsccType osccType = new OsccType();
        osccType.setName("offer");
        osccType.setComplex(true);
        osccType.setNamespace(roaming);
        typeService.save(osccType);

        VersionOfType offer = new VersionOfType();
        offer.setType(osccType);
        offer.setVersion(version);
        offer.setStructure("{\"offer\":{\"Id\":\"string\", \"Name\":\"multilanguage\", \"Description\":\"multilanguage\"," +
                "\"Type\":\"string ---> \", \"VFPLAN\":\"string ---> \", \"Warning_percent\":\"number ---> \", \"Throttling_limit_mb\":\"number ---> \"," +
                "\"Active\":\"boolean ---> \", \"Price\":\"number ---> \", \"Discount_counter_direction\":\"string ---> \", " +
                "\"Warning_text\":\"multilanguage\", \"Throttling_text\":\"multilanguage\", \"Repeatable\":\"boolean ---> \"," +
                "\"Upgrade_offer_ids\":\"offer-list\", \"PSMCodes\":\"PSMCodes\"}}");
        versionOfTypeService.save(offer);
    }
//<Id>49712Dra10m24p</Id>
//        <PSMCodes>
//            <Activation>RNAPI</Activation>
//            <Deactivation>XRNAPI</Deactivation>
//            <Status>SRNAPI</Status>
//            <Repeat>UJRA</Repeat>
//        </PSMCodes>
//        <Name localized="true"></Name>
//        <Active>true</Active>
//        <Description localized="true"></Description>
//        <Type>ROAMING</Type>
//        <VFPLAN>BOTH</VFPLAN>
//        <Throttling_limit_mb>25</Throttling_limit_mb>
//        <Discount_counter_direction>down</Discount_counter_direction>
//        <Price>642</Price>
//        <Warning_percent>80</Warning_percent>
//        <Warning_text localized="true"></Warning_text>
//        <Throttling_text localized="true"></Throttling_text>
//        <Upgrade_offer_ids>
//            <Upgrade_offer_id>49712Dra10m24p</Upgrade_offer_id>
//            <Upgrade_offer_id>51745Dra100m1w</Upgrade_offer_id>
//            <Upgrade_offer_id>51746Dra100m24h</Upgrade_offer_id>
//            <Upgrade_offer_id>53831Dra50m1d</Upgrade_offer_id>
//        </Upgrade_offer_ids>
////        <Repeatable>true</Repeatable>
}
