package com.fitsync.dto.plan;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class MembershipPlanRequest {
    @NotBlank(message = "Plan name is required")
    private String name;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private int durationMonths = 1;
    private List<String> features = new ArrayList<>();
    private boolean popular = false;
    private String description;

    public MembershipPlanRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public int getDurationMonths() { return durationMonths; }
    public void setDurationMonths(int durationMonths) { this.durationMonths = durationMonths; }

    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }

    public boolean isPopular() { return popular; }
    public void setPopular(boolean popular) { this.popular = popular; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
